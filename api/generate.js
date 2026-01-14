import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { word } = req.body;

        // 입력 유효성 검사
        if (!word || typeof word !== 'string') {
            return res.status(400).json({ error: '단어를 입력해주세요.' });
        }

        if (word.length !== 3) {
            return res.status(400).json({ error: '정확히 세 글자를 입력해주세요.' });
        }

        // API 키 확인
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error('ANTHROPIC_API_KEY가 설정되지 않았습니다.');
            console.error('Vercel Dashboard > Settings > Environment Variables에서 ANTHROPIC_API_KEY를 설정해주세요.');
            return res.status(500).json({
                error: 'API 키가 설정되지 않았습니다. 관리자에게 문의해주세요.',
                debug: process.env.NODE_ENV === 'development' ? 'ANTHROPIC_API_KEY environment variable is not set' : undefined
            });
        }

        // Anthropic 클라이언트 생성
        const client = new Anthropic({
            apiKey: apiKey,
        });

        // Claude API 호출
        const message = await client.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 20000,
            temperature: 1,
            system: `당신은 삼행시 작가입니다.
사용자가 입력한 3글자로 삼행시를 작성하세요.

규칙:
1. 각 글자로 시작하는 문장을 작성합니다
2. 긍정적이고 유머러스한 톤을 유지합니다
3. 각 줄은 자연스럽게 이어져야 합니다

출력 형식 (반드시 이 형식만 출력):
[첫번째글자]: [문장]
[두번째글자]: [문장]
[세번째글자]: [문장]

주의: 삼행시 3줄만 출력하세요. 인사말, 설명, 부연설명 등 다른 텍스트는 절대 포함하지 마세요.`,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `${word}\n`,
                        },
                    ],
                },
            ],
        });

        // 응답 텍스트 추출
        const result = message.content[0].text;

        // 결과 반환
        return res.status(200).json({ result });
    } catch (error) {
        console.error('삼행시 생성 오류:', error);

        // API 에러 처리
        if (error.status === 401) {
            return res.status(500).json({ error: 'API 인증 오류가 발생했습니다.' });
        }

        if (error.status === 429) {
            return res.status(429).json({ error: 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' });
        }

        return res.status(500).json({ error: '삼행시 생성 중 오류가 발생했습니다.' });
    }
}
