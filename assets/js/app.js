
window.onbeforeunload = function(e) {
    return '';
};

current_lang='english';
keys = null;
function genWallet(coinConfig)
{
  
  /*
  spend_key_widget = document.getElementById("spend_key_widget");
  view_key_widget = document.getElementById("view_key_widget");
  address_widget = document.getElementById("address_widget");
  address_qr_widget = document.getElementById("address_qr_widget");
  mnemonic_widget = document.getElementById("mnemonic_widget");
  user_entropy_widget = document.getElementById("user_entropy_widget")
*/


    cnUtil = cnUtilGen(coinConfig);
    var address = cnUtil.pubkeys_to_string(_keys.spend.pub, _keys.view.pub);
    var tableWidget = document.getElementById("tableAddresses");
    var row = document.createElement('div');
    row.setAttribute('class','element-wallet');
    var innerHTML = '<div class="user-img"><img src="assets/images/coins/'+coinConfig['symbol']+'.png" alt="'+coinConfig['name']+'" class="img-circle"><span class="profile-status online pull-right"></span></div>';
    innerHTML += '<div class="mail-content"><h5>'+coinConfig['name']+'</h5><span class="mail-desc" id="address_'+coinConfig['symbol']+'" data-title="'+coinConfig['name']+' Wallet" >'+address+'</span>';
    innerHTML += '<div class="m-t-10"><a href="javascript:void(0)" class="link m-r-10 btn-copy" data-clipboard-target="#address_'+coinConfig['symbol']+'">Copy</a><a href="javascript:void(0)" class="link m-r-10 btn-qr-code" data-target="#address_'+coinConfig['symbol']+'">QR code</a></div></div>';
    row.innerHTML = innerHTML;
    tableWidget.appendChild(row);

/*
<a href="javascript:void(0)">
                                <div class="user-img"> <img src="assets/images/coins/XMR.png" alt="user" class="img-circle"> <span class="profile-status online pull-right"></span> </div>
                                <div class="mail-content">
                                    <h5>Toklio</h5> 
                                    <span class="mail-desc">TK2r556JF51QE5QQKTsCD9AGV4H9tRiYxGHN7k7RMkPa7Z1RwKpLgmf4rGfMRLivh58Kq3WRiQ1BYfXcmKJ9eCNy2GtLwTMzc</span> 
                                </div>
                            </a>

*/


 /* spend_key_widget.innerHTML = keys.spend.sec;
  view_key_widget.innerHTML = keys.view.sec;
  address_widget.innerHTML = cnUtil.pubkeys_to_string(keys.spend.pub, keys.view.pub);
  address_qr_widget.innerHTML = "";
  mnemonic_widget.innerHTML = mnemonic;

  // only monero has the URI scheme
  if (prefix_widget.value == "4") {
    qr=new QRCode(address_qr_widget, {correctLevel:QRCode.CorrectLevel.L});
    qr.makeCode("monero:"+keys.public_addr);
  }
  else {
    qr = null;
  }*/
}


var zerohex="0000000000000000000000000000000000000000000000000000000000000000";
var ffhex="ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";


function toggle_qr()
{
  address_qr_widget = document.getElementById("address_qr_widget");
  spend_key_widget = document.getElementById("spend_key_widget");
  view_key_widget = document.getElementById("view_key_widget");
  mnemonic_widget = document.getElementById("mnemonic_widget");
  if (address_qr_widget.style.display=="block") {
    address_qr_widget.style.display="none";
    spend_key_widget.style.display = "block";
    view_key_widget.style.display = "block";
    mnemonic_widget.style.display = "block";
  }
  else {
    address_qr_widget.style.display="block";
    spend_key_widget.style.display = "none";
    view_key_widget.style.display = "none";
    mnemonic_widget.style.display = "none";
  }
}

var _seed = false;
var _keys = false;
var _mnemonic = false;



function genWallets(){

    console.log(_keys);
    if(_keys && !confirm('Are you sure? This wallet cannot be recovered once a new wallet is generated.')) {
        return;
    }
    var tableWidget = document.getElementById("tableAddresses");
    tableWidget.innerHTML = "";
    
    var l = document.getElementById("langSelect");
    var lang = l.options[l.selectedIndex].value;
    current_lang = lang;
    
    _seed = cnUtil.sc_reduce32(cnUtil.rand_32());

     
    spend_key_widget = document.getElementById("spend_key_widget");
    view_key_widget = document.getElementById("view_key_widget");
    mnemonic_widget = document.getElementById("mnemonic_widget");
    

    _keys = cnUtil.create_address(_seed);
    _mnemonic = mn_encode(_seed,current_lang);

    spend_key_widget.innerHTML = _keys.spend.sec;
    view_key_widget.innerHTML = _keys.view.sec;
    mnemonic_widget.innerHTML = _mnemonic;

    for(var c in CONFIG_COINS){
        console.log(CONFIG_COINS[c]);
        genWallet(CONFIG_COINS[c], current_lang);
    }
    initApp();
}
function initLangs(){
    var languesWidget = document.getElementById("langSelect");
    languesWidget.innerHTML = "";
    for(var l in CONFIG_LANG){
        var option = document.createElement('option');
        option.value = CONFIG_LANG[l];
        option.textContent = CONFIG_LANG[l].capitalize();
        if(CONFIG_LANG[l] == 'english'){
          option.selected = "selected";
        }
        languesWidget.appendChild(option);
    }
    
}

function copyFunction(element) {
  var copyText = document.getElementById(element);
  document.execCommand("copy");
  alert("Copied");
}
var qrcode = false; 
$(document).ready(function(){
  initLangs();
  genWallets();
});

function initQrCode(element){
  var qrText = $(element).html();
  $('#qrCodeText').html(qrText);
  $('#modalTitle').html($(element).data('title'));
  console.log(qrText);
  //qrcode.clear(); 
  qrcode.makeCode(qrText);
  $('#modalQrCode').modal('show');
}
function saveFile(){
  var text = "------------ KEYS ------------"; 
  text += "\n\nMnemonic seed : "+$('#mnemonic_widget').html();
  text += "\n\nSpend key : "+$('#spend_key_widget').html();
  text += "\n\nView key : "+$('#view_key_widget').html();

  text += "\n\n------------ WALLETS ------------\n";

  $('.element-wallet').each(function(){
    text += "\n"+$(this).find('h5').html();
    text += "\n"+$(this).find('.mail-desc').html();
    text += "\n";
  });
  
  var file = new File([text], "WalletsKeys.txt", {type: "text/plain;charset=utf-8"});
  saveAs(file);

}
function initApp(){
  new ClipboardJS('.btn-copy');
  if(qrcode){
    qrcode.clear(); // clear the code.
    qrcode.makeCode("https://tokl.io");
  }else {
    qrcode = new QRCode(document.getElementById("qrcode"), {
      text: "https://tokl.io",
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  
  }
 
  $('#qrcode').find('img').addClass('d-block mx-auto');
  $('.btn-qr-code').on('click',function(){
    var target = $(this).data('target');
    initQrCode(target);
  });
}


String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}