// DOM 요소 가져오기
const wordInput = document.getElementById('wordInput');
const generateBtn = document.getElementById('generateBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');

// 결과와 에러 숨기기
function hideAllMessages() {
    loadingSpinner.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

// 에러 표시
function showError(message) {
    hideAllMessages();
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
}

// 결과 표시
function showResult(text) {
    hideAllMessages();
    resultContent.textContent = text;
    resultSection.classList.remove('hidden');
}

// 로딩 표시
function showLoading() {
    hideAllMessages();
    loadingSpinner.classList.remove('hidden');
}

// 버튼 활성화/비활성화
function setButtonState(enabled) {
    generateBtn.disabled = !enabled;
    wordInput.disabled = !enabled;
}

// 입력 유효성 검사
function validateInput(word) {
    if (!word) {
        return '단어를 입력해주세요.';
    }
    if (word.length !== 3) {
        return '정확히 세 글자를 입력해주세요.';
    }
    return null;
}

// 삼행시 생성 API 호출
async function generateAcrostic(word) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '삼행시 생성에 실패했습니다.');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
}

// 삼행시 생성 처리
async function handleGenerate() {
    const word = wordInput.value.trim();

    // 입력 유효성 검사
    const validationError = validateInput(word);
    if (validationError) {
        showError(validationError);
        return;
    }

    // 로딩 시작
    showLoading();
    setButtonState(false);

    try {
        // API 호출
        const result = await generateAcrostic(word);

        // 결과 표시
        showResult(result);
    } catch (error) {
        showError(error.message || '삼행시 생성 중 오류가 발생했습니다.');
    } finally {
        setButtonState(true);
    }
}

// 이벤트 리스너 등록
generateBtn.addEventListener('click', handleGenerate);

// Enter 키로도 생성 가능
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleGenerate();
    }
});

// 입력 시 에러 메시지 숨기기
wordInput.addEventListener('input', () => {
    if (!errorSection.classList.contains('hidden')) {
        hideAllMessages();
    }
});
