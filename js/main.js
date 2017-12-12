// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript


/**
 * Your thoughtful comment here.
 */

/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
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
  print(terminal,"array length is " + inputList.length );
  for(var i = 0; i < inputList.length; i++) {
    var token = inputList[i];
    if (!(isNaN(Number(token)))) {
      print(terminal,"pushing " + Number(token));
      stack.push(Number(token));
    } else if (token === ".s") {
      print(terminal, " <" + stack.length + "> " + stack.slice().join(" "));
    } else if (token === ":") {
      var word = inputList[++i];
      var stringDef = "";
      for(++i; i < inputList.length && inputList[i]!= ";"; i++) {
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

// Whenever the page is finished loading, call this function.
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);

    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

    var stack = [];

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");
    runRepl(terminal, stack);
});
