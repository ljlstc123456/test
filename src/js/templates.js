//HEAD 
window["TPL"] = {};

window["TPL"]["../src/tpl/article.html"] = "<%$.each(articles,function(i,r){%>\n" +
    "<article data-more=\"<%=r.filename%>\">\n" +
    "    <h2 class=\"title\">\n" +
    "      <a href=\"javascript:void(0)\"><%=r.title%></a>\n" +
    "      <span class=\"close-article\">-></span>\n" +
    "    </h2>\n" +
    "    <div class=\"text-container\">\n" +
    "      <ul class=\"text\">\n" +
    "        <p><%=r.content%></p>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "    <div class=\"textfoot\">\n" +
    "      <a href=\"javascript:void(0)\">阅读全文</a>\n" +
    "    </div>\n" +
    "</article> \n" +
    "<%})%>"; 
// END 