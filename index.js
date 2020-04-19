addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

var randomVariant;

/**
 * Response
 * @param {Request} request
 */
async function handleRequest(request) {
  //console.log(request.connection.remoteAddress)
  if(request.headers.cookie) {
    randomVariant = getCookies['variantVersion']
  } else {
    randomVariant = Math.round(Math.random())
  }
  var res = await(await fetch('https://cfw-takehome.developers.workers.dev/api/variants')).json();
  
  var oldResponse = await fetch(res.variants[randomVariant]);
  var newResponse = changeResponse(oldResponse);

  return new Response(newResponse.body, {
    headers: { 'content-type': 'text/html' }
  });
}


function changeResponse(oldResponse) {
  return new HTMLRewriter()
        .on('head', new CookieHandler())
        .on('body', new CookieInvoker())
        .on('h1', new H1Handler())
        .on('title', new TitleHandler())
        .on('p', new ParagraphHandler())
        .on('a', new HrefContentHandler())
        .transform(oldResponse)
}

class TitleHandler {
  element(element) {
    element.replace("<title>Vivek</title>", {html: true})
  }
}

class CookieInvoker {
  element(element) {
    element.prepend("\n<script type=\"text/javascript\">\n" +
    "\tsetCookie();\n" +
    "</script>\n", { html: true })
  }
}

class CookieHandler {
  element(element) {

    if(randomVariant == 0) {
      element.prepend(
      "        <script type=\"text/javascript\">\n" +
      "            function setCookie() {\n" +
      "              var date = new Date();\n" +
      "              var days = 7;\n" +
      "              date.setTime(date.getTime() + (days*24*60*60*1000));\n" +
      "              var expires = \"expires=\"+ date.toUTCString();\n" +
      "              document.cookie = \"variantVersion=0;\" + expires + \";path=/\";SameSite=None;Secure;\n" +
      "\t\t\t}\n" +
      "        </script>\n", { html: true })
    } else {
      element.prepend(
      "        <script type=\"text/javascript\">\n" +
      "            function setCookie() {\n" +
      "              var date = new Date();\n" +
      "              var days = 7;\n" +
      "              date.setTime(date.getTime() + (days*24*60*60*1000));\n" +
      "              var expires = \"expires=\"+ date.toUTCString();\n" +
      "              document.cookie = \"variantVersion=1;\" + expires + \";path=/\";SameSite=None;Secure;\n" +
      "\t\t\t}\n" +
      "        </script>\n", { html: true })
    }
  }
}

class H1Handler {
  element(element) {
    element.replace("Vivek", { html: false })
  }
}

class ParagraphHandler {
  element(element) {
    ""
    element.replace("<p class=\"text-sm leading-5 text-gray-500\" id=\"description\">\n" +
    "The fact that Cloudflare workers are faster than Docker is simply amazing!\n" +
     "</p>", { html: true })
  }
}

class HrefContentHandler {
  element(element) {
    "<script type=\"text/javascript\">\n" +
    "setCookie();\n" +
    "</script>"
    var updateLinkedinProfile;
    if(randomVariant == 0) {
      updateLinkedinProfile = "<a\n" +
      "class=\"inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5\"\n" +
      "href=\"https://www.linkedin.com/in/vivekshresta\"\n" +
      "id=\"url\"\n" +
      ">\n" +
      "My Linkedin\n" +
      "</a>";
    } else {
      updateLinkedinProfile = "<a\n" +
      "class=\"inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5\"\n" +
      "href=\"https://www.linkedin.com/in/vivekshresta\"\n" +
      "id=\"url\"\n" +
      ">\n" +
      "My Linkedin\n" +
      "</a>";
    }

    element.replace(updateLinkedinProfile, { html: true})
  }
}

function getCookies(request) {
  var cookies = {};
  request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
    var parts = cookie.match(/(.*?)=(.*)$/)
    cookies[ parts[1].trim() ] = (parts[2] || '').trim();
  });
  return cookies;
}
