const startButton = document.getElementById('start-button');
const setPlayersButton = document.getElementById('set-players');
const tableBody = document.getElementById('table-body');
const playerInput = document.getElementById('player-names');

let players = []; // 選手名を格納する配列

// 選手名を設定
setPlayersButton.addEventListener('click', () => {
  const input = playerInput.value.trim();
  if (input) {
    players = input.split(',').map(name => name.trim());
    updateTableHeader();
    alert('選手名が設定されました: ' + players.join(', '));
  } else {
    alert('選手名を入力してください');
  }
});

// 音声認識の処理
startButton.addEventListener('click', () => {
  if (players.length === 0) {
    alert('まずは選手名を設定してください');
    return;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ja-JP'; // 日本語対応
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript; // 音声入力されたテキスト
    processInput(transcript);
  };

  recognition.onerror = (event) => {
    alert('音声認識エラーが発生しました：' + event.error);
  };
});

// 入力を処理
function processInput(input) {
  const rows = [];

  input.split(/[、。\s]+/).forEach((part) => {
    players.forEach((player) => {
      if (part.startsWith(player)) {
        const time = part.replace(player, '');
        if (!rows[rows.length - 1] || rows[rows.length - 1][player]) {
          rows.push({ [player]: time });
        } else {
          rows[rows.length - 1][player] = time;
        }
      }
    });
  });

  updateTable(rows);
}

// テーブルのヘッダーを更新
function updateTableHeader() {
  const tableHeader = document.querySelector('thead tr');
  tableHeader.innerHTML = '<th>タイム番号</th>';
  players.forEach(player => {
    const th = document.createElement('th');
    th.textContent = player;
    tableHeader.appendChild(th);
  });
}

// テーブルの内容を更新
function updateTable(rows) {
  tableBody.innerHTML = '';
  rows.forEach((row, index) => {
    const tr = document.createElement('tr');
    const tdIndex = document.createElement('td');
    tdIndex.textContent = `タイム${index + 1}`;
    tr.appendChild(tdIndex);

    players.forEach((player) => {
      const td = document.createElement('td');
      td.textContent = row[player] || '-';
      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}
