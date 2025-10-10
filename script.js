// 메모 데이터를 저장할 배열
let memos = [];

// DOM 요소들 가져오기
const memoInput = document.getElementById('memoInput');
const memoList = document.getElementById('memoList');

// 페이지 로드 시 저장된 메모 불러오기
window.addEventListener('load', function() {
    loadMemos();
    displayMemos();
    setupWindowControls();
});

// 메모 추가 함수
function addMemo() {
    const memoText = memoInput.value.trim();
    
    // 빈 메모는 추가하지 않음
    if (memoText === '') {
        return;
    }
    
    // 새 메모 객체 생성
    const newMemo = {
        id: Date.now(), // 고유 ID 생성
        text: memoText,
        date: new Date().toLocaleString('ko-KR')
    };
    
    // 메모 배열에 추가
    memos.push(newMemo);
    
    // 입력창 초기화
    memoInput.value = '';
    
    // 화면에 메모 표시
    displayMemos();
    
    // 로컬 스토리지에 저장
    saveMemos();
    
    // 입력창에 포커스
    memoInput.focus();
}

// 메모 삭제 함수
function deleteMemo(id) {
    // 확인 메시지
    if (confirm('정말로 이 메모를 삭제하시겠습니까?')) {
        // 해당 ID의 메모를 배열에서 제거
        memos = memos.filter(memo => memo.id !== id);
        
        // 화면 업데이트
        displayMemos();
        
        // 로컬 스토리지에 저장
        saveMemos();
    }
}

// 메모 목록 화면에 표시
function displayMemos() {
    // 메모 목록 초기화
    memoList.innerHTML = '';
    
    // 메모가 없을 때
    if (memos.length === 0) {
        memoList.innerHTML = '<div class="empty-message">📝 아직 메모가 없습니다.<br>위에서 메모를 추가해보세요!</div>';
        return;
    }
    
    // 메모들을 역순으로 표시 (최신 메모가 위에)
    memos.slice().reverse().forEach(memo => {
        const memoElement = document.createElement('div');
        memoElement.className = 'memo-item';
        memoElement.innerHTML = `
            <div class="memo-text">${memo.text}</div>
            <div class="memo-date">${memo.date}</div>
        `;
        
        // 메모 클릭 시 삭제
        memoElement.addEventListener('click', () => {
            deleteMemo(memo.id);
        });
        
        memoList.appendChild(memoElement);
    });
}

// 로컬 스토리지에 메모 저장
function saveMemos() {
    localStorage.setItem('memos', JSON.stringify(memos));
}

// 로컬 스토리지에서 메모 불러오기
function loadMemos() {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
        memos = JSON.parse(savedMemos);
    }
}

// 윈도우 컨트롤 설정
function setupWindowControls() {
    const minimizeBtn = document.querySelector('.window-btn.minimize');
    const maximizeBtn = document.querySelector('.window-btn.maximize');
    const closeBtn = document.querySelector('.window-btn.close');
    
    minimizeBtn.addEventListener('click', function() {
        document.querySelector('.window').style.display = 'none';
        setTimeout(() => {
            document.querySelector('.window').style.display = 'flex';
        }, 1000);
    });
    
    maximizeBtn.addEventListener('click', function() {
        const window = document.querySelector('.window');
        if (window.style.width === '100vw') {
            window.style.width = '800px';
            window.style.height = '600px';
        } else {
            window.style.width = '100vw';
            window.style.height = '100vh';
        }
    });
    
    closeBtn.addEventListener('click', function() {
        if (confirm('메모앱을 종료하시겠습니까?')) {
            window.close();
        }
    });
}

// 툴바 버튼 기능
function setupToolbar() {
    const toolBtns = document.querySelectorAll('.tool-btn');
    
    toolBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            alert(`${text} 기능은 준비 중입니다.`);
        });
    });
}

// Enter 키로 메모 추가
memoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addMemo();
    }
});

// 입력창에 포커스
memoInput.focus();

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter로 메모 추가
    if (e.ctrlKey && e.key === 'Enter') {
        addMemo();
    }
    
    // Escape로 입력창 초기화
    if (e.key === 'Escape') {
        memoInput.value = '';
        memoInput.focus();
    }
});

// 툴바 설정
setupToolbar();

// 메모 개수 표시 함수
function updateMemoCount() {
    const count = memos.length;
    console.log(`현재 메모 개수: ${count}개`);
}

// 메모 추가/삭제 시 개수 업데이트
const originalAddMemo = addMemo;
addMemo = function() {
    originalAddMemo();
    updateMemoCount();
};

const originalDeleteMemo = deleteMemo;
deleteMemo = function(id) {
    originalDeleteMemo(id);
    updateMemoCount();
};
