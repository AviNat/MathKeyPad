# MathKeyPad
example for integrating a virtual keyboard for math expressions to Moodle Formulas question

this js library use the open source MathLive virtual keyboard library and a wrapper to integrat in a Formulas question in moodle 
the XML file is a moodle backup file that can be restored into any course 

key elements in the question (formulas)

// in the Random Variables section: create a unique ID that identifies the HTML elements 
mb={100000:999999};

// in the question content section: definition of one or more input fields that will be attached to the LiveMath virtual keyboard.
// the element is given a uinqui ID using the value in mb
<div dir="ltr">
    <span dir="ltr">\( \frac {\sqrt{2}+1}{\sqrt{2}-1} = \)</span>
    <span id="mf1{mb}" style="display: inline-block; padding: 2px 3px; border: 1px solid #808080; min-width: 8ch;">...
</span>
  
// in the question parts section
// input type algebraic formula (can also be numeric formula)
// answer: consists of two hiden field, one for the algebraic expression and the other for the user original input encoded 
["ans1","0"]
// part content (this content is hidden 
<div id="part1-{mb}" dir="ltr">
    algebric expression {_0}<br> encoded latex {_1} 
</div>
// grading variables 
cc=diff(["ans1"],[_0]);
// grading rule, only the first input field is considered 
cc[0] == 0 ? 1 : 0
  

