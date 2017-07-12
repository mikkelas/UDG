var $menuElem = $(".skts-nav-guide");

function addPrettyPrint($elem) {
  var tabstr = $elem.html().match(/[ \t]+/gi)[0];
  var regex = new RegExp("\n" + tabstr, "gi");
  var html = $elem.html().replace(regex, '\n');
  var str = $('<div/>').text($.trim(html)).html()
  .replace(/\t/g, '&nbsp;')
  .replace(/\s*style=\".*?\"/g, '')
  .replace(/skts-guide-frame/g, '')
  .replace(/skts-guide-fitme/g, '')
  .replace(/\bng-[a-z]+\b/g, '')
  .replace(/\s*class=\"\s*\"/g, '')
  .replace(/æ/g, '&&zwnj;aelig;')
  .replace(/ø/g, '&&zwnj;oslash;')
  .replace(/å/g, '&&zwnj;aring;')
  .replace(/Æ/g, '&&zwnj;AElig;')
  .replace(/Ø/g, '&&zwnj;Oslash;')
  .replace(/Å/g, '&&zwnj;Aring;');
  $elem.after('<pre class="prettyprint linenums">' + str + '</pre>');
}

function showBWicons() {
  $(".icon-table .skts-icon:not('.skts-icon--large'):not('.skts-icon--small')").each (function(){
    var $iconElem = $(this),
        clonedWhiteElem = $iconElem.clone(),
        clonedBlackElem = $iconElem.clone(),
        clonedBlackElemClass =  clonedBlackElem.attr("class"),
        clonedWhiteElemClass =  clonedWhiteElem.attr("class"),
        clonedFileLocation = $("[data-file-path]", clonedBlackElem).attr("data-file-path"),
        clonedFileLocationArray = clonedFileLocation.split(".svg");

    clonedBlackElem.attr("class", clonedWhiteElemClass + "-sort");
    $("a", clonedBlackElem).attr("data-file-path", clonedFileLocationArray[0] + "--sort.svg");
    clonedBlackElem.insertBefore($iconElem).parent();

    clonedWhiteElem.attr("class", clonedWhiteElemClass + "-hvid").attr("style", "background-color: black");
    $("a", clonedWhiteElem).attr("data-file-path", clonedFileLocationArray[0] + "--hvid.svg");
    clonedWhiteElem.insertBefore($iconElem).parent();
  });
  setToolTip()
}
function setToolTip() {
  $('.icon-table .skts-icon').tooltip({
      title: function () {
          return $(this).attr('class');
      }
  });
}

function setModalLinks($linkElem) {
  var iconPath = $linkElem.attr("data-file-path"),
      iconName = iconPath.substring(iconPath.lastIndexOf("/") + 1).split('.')[0],
      pngPath = "assets/images/ikoner/";

      $(".js-icon-name").text(iconName);
      $("#js-svg-link").attr("href", iconPath).attr("download", iconName+".svg");
      $("#js-png-link").attr("href", pngPath + iconName + ".png").attr("download", iconName+".png");
}

// Hide Header on on scroll down START
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('.header-show').removeClass('guide-nav-down').addClass('guide-nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('.header-show').removeClass('guide-nav-up').addClass('guide-nav-down');
        }
    }
    
    lastScrollTop = st;
}

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);
// Hide Header on on scroll down END


$(function () {

  $("#showBWicons").on("click", function(){
    showBWicons();
    $(this).addClass("hidden");
    $("#showNormalIcons").removeClass("hidden");
  });
  
  $(".icon-table .skts-icon a").each (function() {
      var $linkElem = $(this),
          filePath = $linkElem.attr("href");

      $linkElem.attr("data-toggle", "modal").attr("data-target", "#downloadModal").attr("data-file-path", filePath).attr("href", "#");
  });

  $(document).on("click", ".icon-table .skts-icon a",  function (e) {
    e.preventDefault();
    setModalLinks($(this));
  });
 
  $menuElem.affix({
    offset: { top: 150}
  });

  $("div[data-pretty]").each(function(){
    addPrettyPrint($(this));
  });

  setToolTip();

  prettyPrint();
})