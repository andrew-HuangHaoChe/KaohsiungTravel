$(document).ready(function(){
  $('.carousel.carousel-slider').carousel({
    fullWidth: true
  }).height(500);
  $('select').formSelect();
  M.AutoInit();
});

$('i#prev').click(function() {
  $('.carousel').carousel('prev');
});

$('i#next').click(function() {
  $('.carousel').carousel('next');
});
let area = document.getElementById("areaId");
getData();
let data = {};
function getData() {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json",
    true
  );
  xhr.send();
  xhr.onload = function () {
    data = JSON.parse(xhr.responseText).result.records;
    console.log(data);
    renderList(data);
    pagination(data);
  };
}
function renderList(data) {
  let array = data;
  let secary = new Array();
  for (let i = 0; i < array.length; i++) {
    secary.push(array[i].Zone);
  }
  let areaList = secary.filter(function (element, index, array) {
    return array.indexOf(element) === index;
  });
  /*---------------------------------------------------------------------------
        //當陣列(arr)去比對(.indexOf)裡面的元素element === 索引值(index)，就回傳(return)出來
        //indexOf 是用於取陣列的索引位置
        //撈出來的陣列資料長這樣 ["三民區", "三民區","三民區","鼓山區","鼓山區","鳳山區"....];
        //indexOf(element)的特性是在同樣資料內容取第一筆，這邊會回傳值會是0123456類推.... 
        //index的值會是0123456...類推。所以這邊陣列中第一筆資料"三民區"，因為0===0 所以回傳，
        //第二筆"三民區"雖然1===1但是重複了所以不回傳。3===3回傳"鼓山區"，5===5回傳"鳳山區"，
        //這樣一次將所有不同行政區取出再套入節點option裡面。

        //element: 陣列裡面的值
        //index: 索引位置
        //arr: 陣列的本身
        //indexOf 是會回傳給定元素於陣列中第一個被找到之索引若不存在於陣列中則回傳 -1。

        //因此 arr.indexOf(element) 意思是比如圖片陣列中的 a 他會回傳他的索引位置
        //也就是 2 ，而最後一項也是 a 但因為 indexOf 只會回傳第一次找到的索引，
        //所以他就會回傳 2
        //接著 arr.indexOf(element) === index 就是 indexOf 的索引與迴圈的索引去比對
        //當兩個相同時就回傳該值
        ---------------------------------------------------------------------------*/
  console.log(areaList);
  var Options="";
    $.each(areaList, function(i, val){ 
      Options=Options+"<option value='"+val+"'>"+val+"</option>";
    });
    $('#areaId').empty();
    $("#areaId").append(Options);
    $("#areaId").formSelect()
}
area.addEventListener("change", updateList, false);
function updateList(e) {
  //當change時
  let len = data.length;
  let select = e.target.value; //當下使用者選到的"select"的值----XX區
  let title = document.querySelector(".title");
  let list = document.querySelector(".list");
  let instr = "";
  for (let i = 0; i < len; i++) {
    if (select == data[i].Zone) {
      //若選到的值 == 陣列內XX區的話
      title.textContent = data[i].Zone; //替換標題為選到的區
      instr += `
      <li class="card">
        <div class="cardtop" style="background-image:url( ${data[i].Picture1})">
          <div class="area_block">
            <p class="Attractions">${data[i].Name} </p>
            <p class="zoonName">${data[i].Zone} </p>
          </div>
        </div>
        <div class="cardbody">
          <ul class="cardContent clearfix">
            <li style="vertical-align:bottom;">
              <i class="far fa-clock"></i>
              ${data[i].Opentime}
            </li>
            <li style="vertical-align:bottom;">
              <i class="fas fa-map-marker-alt"></i>
              ${data[i].Add}
            </li>
            <li style="vertical-align:bottom;">
              <i class="fas fa-phone"></i>
              ${data[i].Tel}
              <span class="info">
                <i class="far fa-file"></i>
                ${data[i].Ticketinfo}
              </span>
            </li>
          </ul>
        </div>
      </li>`
    }
  }
  list.innerHTML = instr;
}
let hel = document.querySelector(".district");
//熱門區域
function hotZonelist(e) {
  let len = data.length;
  let sec = e.target.value;
  let title = document.querySelector(".title");
  let list = document.querySelector(".list");
  let hotstr = "";
  for (let i = 0; i < len; i++) {
    if (sec == data[i].Zone) {
      title.textContent = data[i].Zone; //替換標題為選到的區
      hotstr += 
      `<li class="card">
        <div class="cardtop" style="background-image:url('${data[i].Picture1}')">
          <div class="area_block">
            <p class="Attractions">${data[i].Name}</p>
            <p class="zoonName">${data[i].Zone}</p>
          </div>
        </div>
        <div class="cardbody">
          <ul class="cardContent clearfix">
            <li style="vertical-align:bottom;">
              <i class="far fa-clock"></i>
              ${data[i].Opentime}
            </li>
            <li style="vertical-align:bottom;">
              <i class="fas fa-map-marker-alt"></i>
              ${data[i].Add}
            </li>
            <li style="vertical-align:bottom;">
              <i class="fas fa-phone"></i>
              ${data[i].Tel}
              <span class="info">
                <i class="far fa-file"></i>
                ${data[i].Ticketinfo}
              </span>
            </li>
          </ul>
        </div>
      </li>`
    }
  }
  list.innerHTML = hotstr;
}
hel.addEventListener("click", hotZonelist, false);

function pagination(data) {
  const datatotal = data.length; //取得資料長度
  const perpage = 5; //要顯示在畫上的資料量，預設一頁有五筆
  const pageTotal = Math.ceil(datatotal / perpage); //page按鈕總量計算 總資料量/每一頁要顯示的資料量；有可能出現餘數因此要無條件進位。
  console.log(`全部資料:${datatotal}每頁:${perpage}總頁數:${pageTotal}`);
  let currentPage = 2; //當前頁數
  //"當前頁數"比"總頁數"大時，"當前頁數"就等於"總頁數"
  if (currentPage > pageTotal) {
    current = pageTotal;
  }
  //切換頁面時，資料要重新吐出來，一頁是5筆，那他就會吐1~5筆，換到第二頁時就會變成第6筆開始，6~10筆
  const minData = currentPage * perpage - perpage + 1; //當前頁面去乘每一頁顯示得數量再減去每一頁顯示得數量，此時會得到 5 這個數字，但是我們是第 6 筆開始，所以要在+1。
  const maxData = currentPage * perpage;
  const dataIndex = [];
  data.forEach((item, index) => {
    const num = index + 1; //獲取陣列索引，因為索引是從0開始所以要+1。
    //當num比minData大且小於maxData就push進新的陣列
    if (num >= minData && num <= maxData) {
      dataIndex.push(item);
    }
  });
  const page = {
    //用物件的方式將這個function內的資料傳到另一個function內做處理
    pageTotal,
    currentPage,
    haspage: currentPage > 1,
    hasNext: currentPage < pageTotal,
  };
}
