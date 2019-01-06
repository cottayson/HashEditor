'use strict'
let content;
let selectedKey = -1; // ключ изначально не выбран

// TODO: исправить баг:
// при открываем без d&d файл с ошибкой, 
// а затем открываем без ошибки
// файл не обновляется

// TODO: сделать форму с произвольным количеством полей
function handleFiles(files, dragAndDrop = false) {
  const reader = new FileReader();
  reader.addEventListener("load", function() {
    try {
      content = JSON.parse(this.result); // this = reader
      parsing(content); // если ошибок нет => обрабатываем
      if(dragAndDrop) {
        alert("файл успешно загружен методом тяни & пускай");
      }
    } catch(exception) {
      alert("Ошибка чтения JSON: " + exception);
    } finally {
      //console.log("content =", content);
    }
  });
  reader.readAsText(files[0]);
}

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', function(e) {
  handleFiles(this.files); // input.files
});

document.addEventListener('dragover', function(e) {
  e.preventDefault(); // обнуляет поведение элемента
  e.stopPropagation(); // останавливает всплытие в элементах, которые содержат данный
});

document.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
  handleFiles(e.dataTransfer.files, true);
});

/* target.addEventListener(type(string), listener(func), useCapture(boolean))
useCapture has not always been optional. 
Ideally, you should include it(useCapture = false) 
for the widest possible browser compatibility. */

function parsing(FileContent) {
  // здесь мы ждем содержимое файла
  // файл у нас содержит объект
  // этот файл контент нужно прикрепить к общей видисомсти текущего жс файла
  clearGrid();
  for (var key in FileContent) {
    // if (FileContent.hasOwnProperty(key)) {
      createRecordGrid(key)
    // }
  }
  enableUI();
}

function enableUI() {
  let info = document.getElementById("info");
  let dropArea = document.getElementById("drop-area");
  info.style.display = "block";
  dropArea.style.display = "none";
}

function disableUI() {
  let info = document.getElementById("info");
  let dropArea = document.getElementById("drop-area");
  info.style.display = "none";
  dropArea.style.display = "block";
}

function clearGrid() {
  let grid = document.getElementById("grid");
  grid.innerHTML = ''; // remove divs
}

function createRecordGrid(key) {
  let recordElement = document.createElement('div');
  let grid = document.getElementById("grid");
  
  recordElement.innerText = key;
  recordElement.classList.add("record");
  grid.appendChild(recordElement);
  recordElement.addEventListener('click', gridRecordClick);
}

function gridRecordClick(event) {
  let info = document.getElementById("info");
  console.log(event.target);
  let elem = this; //  event.currentTarget = this
  let key = elem.innerText;
  setInfo({
    key,
    info: content[key]
  });
  selectedKey = key;
  //info.innerText = e;
  //	e.target = кликнутый элемент, но это не точно, мог ощибиться
  // при клике получить ключ из innerText
  // обратиться в объект-хранилище ключей-значений FileContent
  // получить значение по ключу.
  // значение по ключу передать в функцию setInfo
}

function setInfo(record) {
  console.log("record", record);
  let spanHash = document.getElementById("span-hash");
  let editInfo = document.getElementById("edit-info");
  spanHash.innerText = record.key;
  editInfo.value = record.info.value;
  /*
  получить ссылки на элементы в info
  кажлому элементу передать его значение по ключу из рекоорда
  */
}

function getInfo() {
  let record = {};
  let editInfo = document.getElementById("edit-info");
  record.key = selectedKey;
  record.info = {
    value: editInfo.value
  }
  /*
  из каждого элемента info поулчить информацию
  по ключу добавить в result
  */
  return record;
}

function buttonRecordSaveClick() {
  if(selectedKey === -1) {
    alert("hash не выбран");
  } else {
    let record = getInfo();
    content[record.key] = record.info;
    alert("hash сохранён");
  }
}

function exportFileContent() {
  // *** vanilla saveJSON ***
  download(JSON.stringify(content),
      'test.json', 'application/json');
  // *** p5 saveJSON ***
  //saveJSON(content, 'test.json', true);
  /*
  нужно вызвать SaveFile, downloadFile
  c содержимым FileContent
  */
}

function download(content, fileName, contentType) {
    // внимание костыль
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

