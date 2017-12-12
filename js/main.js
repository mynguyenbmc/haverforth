/**
 * I originally did this lab in Racket, so Javascript is very different. Syntax aside, Racket is functional and I worked with unmutated data and unchanging states, while Javascript
 allows OOP, passes objects by reference and directly mutates them, which to me makes things easier to deal with but also easier to break if you're not careful and inaccurately mutate the stack.
 The Stack ADT here is an array, as opposed to a struct with list of elements and size in previous labs.
 * I did this in Racket which lacked types like Javascript, so it didn't make much of a difference.
 * Luckily Javascript's lack of types hasn't hurt me so far, again because I'm quite used to Racket. To be honest, I find dynamic typing easier to work with at least while coding, because I can focus more
 on the algorithms and structures without worrying about type checking. But it can also lead to big problems if I'm not careful and forget what exactly I'm dealing with; this has happened to me many times in Racket.
 Perhaps for work I'd prefer static typed languages like C++ or Java to be safe, but personally I find dynamic typed ones more fun.
 * Objects: In Racket I worked with struct, list,...while in Javascript almost everything is an object and we can add properties, functions,..to it easily.
 * Map: In Racket I used a HashTable ADT, while in Javascript I just use an object with associative key/value hashing as its properties. It's very convenient.
 * Closures: I love how easy closure is in Javascript. In C++ the syntax is quite annoying, and in Racket I mostly use lambda wrapping (not sure if this is an understable term), but Javascript closure is so concise and nice.
 * Javascript debugger shows all the variables (local and global) as we step in/over it, making it very easy to see what's going on with the program as a whole and each varible individually.
 */
/**
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}
/**
 * Sync up the HTML with the stack in memory
 * @param {Array[Number]} The stack to render
 */
var resetButton = $("#reset");
function renderStack(stack) {
    $("#thestack").empty();
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
    resetButton.click(function(stack) {
      while (stack.length > 0) {
        stack.pop();
      }
    });
};

function add(stack) {
  var first = stack.pop();
  var second = stack.pop();
  stack.push(first+second);
}
function sub(stack) {
  var first = stack.pop();
  var second = stack.pop();
  stack.push(second-first);
}
function mult(stack) {
  var first = stack.pop();
  var second = stack.pop();
  stack.push(first*second);
}
function div(stack) {
  var first = stack.pop();
  var second = stack.pop();
  stack.push(second/first);
}
function nip(stack) {
  swap(stack);
  stack.pop();
}
function swap(stack) {
  var first = stack.pop();
  var second = stack.pop();
  stack.push(first);
  stack.push(second);
}
function over(stack) {
  var first = stack.pop();
  var second = stack.pop();
  stack.push(second);
  stack.push(first);
  stack.push(second);
}
function equalTo(stack) {
  var first = stack.pop();
  var second = stack.pop();
  if(first==second) {
    stack.push(-1);
  } else {
    stack.push(0);
  }
}
function greaterThan(stack) {
  var first = stack.pop();
  var second = stack.pop();
  if(second>first) {
    stack.push(-1);
  } else {
    stack.push(0);
  }
}
function smallerThan(stack) {
  var first = stack.pop();
  var second = stack.pop();
  if(second<first) {
    stack.push(-1);
  } else {
    stack.push(0);
  }
}

var words = { "+":add, "-":sub, "*":mult, "/":div, "nip":nip, "swap":swap, "over":over, "=":equalTo, ">":greaterThan, "<":smallerThan };
/**
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */
function process(stack, input, terminal) {
  var inputList = input.trim().split(/ +/);
  for(var i = 0; i < inputList.length; i++) {
    var token = inputList[i];
    if (!(isNaN(Number(token)))) {
      print(terminal,"pushing " + Number(token));
      stack.push(Number(token));
    } else if (token === ".s") {
      print(terminal, " <" + stack.length + "> " + stack.slice().join(" "));
    } else if (token === ":") {
      // this allows for both func defs and calls within one line, e.g 2 3 : dbl 2 * ; dbl
      var word = inputList[++i];
      var stringDef = "";
      for(++i; i < inputList.length && inputList[i]!= ";"; i++) { //gather everything until ;
        stringDef += " " + inputList[i];
      }
      words[word] = function(aStack) { process(aStack, stringDef, terminal);};
    }
     else if (token in words) {
      words[token](stack);
    } else {
        print(terminal, ":-( Unrecognized input");
    }
  }
    renderStack(stack);
};

function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        print(terminal, "User typed in: " + line);
        process(stack, line, terminal);
        runRepl(terminal, stack);
    });
};

$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);

    $("#terminal").append(terminal.html);

    var stack = [];

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");
    runRepl(terminal, stack);
});
