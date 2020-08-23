// AviLib.mjs

import MathLive from 'https://unpkg.com/mathlive/dist/mathlive.mjs';

class formulasPart {
    constructor(partName, partType) {
        this.name = partName;
        this.type = partType;
		this.fields = [...document.getElementById(this.name).getElementsByClassName("formulas_" + this.type)];
    }
    getValue(id = 0) {
        return this.fields[id].value;
    }
    setValue(id, val) {
        this.fields[id].value = val;
    }
    storeExp(id, str) {
        this.fields[id].value = str.length > 0 ? [...str].map(c => c.charCodeAt(0)).join('+') : '';
    }
    getExp(id = 0) {
        const str = this.fields[id].value;
        return str.length > 0 ? str.split('+').map(x => String.fromCharCode(Number(x))).join('') : "";
    }
	setStyleObj(id, style) {
		const s = this.fields[id].style;
		for (const k in style) s[k] = style[k];
	}
    setStyle(id, key, value) {
        this.fields[id].style[key] = value;
    }
    hide(id) {
        this.fields[id].style.display = "none";
    }
    hideAll() {
        document.getElementById(this.name).style.display = "none";
    }
    listener(event, func, id = 0) {
        this.fields[id].addEventListener(event, func);
    }
}

class MathInputField {
    constructor(elementName, exprText, part, keyboardRows = undefined) {
        this.name = elementName;
        document.getElementById(elementName).textContent = exprText;
        this.mf = MathLive.makeMathField(elementName, {
            /* OPTIONS */
            smartMode: false,
            defaultMode: 'math',
            letterShapeStyle: 'tex',
            virtualKeyboardMode: 'onfocus',
            keypressVibration: false,
            /* CUSTOM KEYBOARD */
			virtualKeyboards: 'avi-keyboard',
            customVirtualKeyboards: {
                'avi-keyboard': {
                    label: '',
                    tooltip: '',
                    layer: 'avi-layer'
                }
            },
            customVirtualKeyboardLayers: {'avi-layer': {rows: []}},
            /* HOOKS*/
            onModeChange: (mf, mode) => mode === 'text' && mf.$perform(['switchMode', 'math']),
            onContentDidChange: mf => {
			    // console.log(mf.$text());
                // console.log(mf.$text('ASCIIMath'));
				// pass the input to Formulas 
                part.setValue(0, mf.$text('ASCIIMath'));  // the algebraic text
                part.storeExp(1, mf.$text());             // encoded version of the LaTeX string, the encoding is required to fit Formulas format
              
            },
        });
		this.mf.$blur();
		this.setKeyboard = this.setKeyboard.bind(this);
		this.setKeyboard(keyboardRows || [
			['x', 'y', ['\\square^2', '^2'], ['\\square^\\square', '^\\placeholder{}'], 0, '1', '2', '3', '\\div', 0,'_BACKSPACE'],
			[['(', '(\\placeholder{})'], ')', '>', '<', 0, '4', '5', '6', ['\\times', '\\cdot'],0, '_LEFTARROW'],
			['\\lvert \\placeholder{} \\rvert', ',', '\\ge', '\\le', 0, '7', '8 ', '9', '-',0, '_RIGHTARROW'],
			['\\sqrt', '\\pi', '\\ne', '\\frac', 0, '.', '0', '=', '+', 0,'_CLEARALL']
		]);
    }
	
	createVirtualKey(latex) {
      // if given a custom tuple of [LABEL, MATH] - the label is used as is.
      if (Array.isArray(latex))
        return { latex: latex[0], insert: latex[1], class: 'keycap tex' };
      let command = undefined;
      switch (latex.toLowerCase ? latex.toLowerCase() : latex) {
		// gap, narrower than a regular key
		case 0:
		case '_gap':
		  return { class: 'separator w5' };
		// gap, same width as a regular key
		case '_keygap':
		  return { class: 'separator keycap' };
		// left arrow: prev char
		case '_leftarrow':
		  latex = '\\leftarrow';
		  command = ['performWithFeedback', 'moveToPreviousChar'];
		  break;
		// right arrow: next char
		case '_rightarrow':
		  latex = '\\rightarrow';
		  command = ['performWithFeedback', 'moveToNextChar'];
		  break;

		case '_backspace':
		  latex = 'Del';
		  command = ['performWithFeedback', 'deletePreviousChar'];
		  break;
		case '_clearall':
		  latex = 'AC';
		  command = ['performWithFeedback', 'deleteAll'];
		  break;
		}
				
		return { latex, command, class: 'keycap tex' };
	}
	setKeyboard(keyRows) {
		this.mf.$setConfig({
			customVirtualKeyboardLayers: {
				'avi-layer': {
					rows: keyRows.map(row => row.map(this.createVirtualKey))
                    }
				}
			})
	};
}

// ... export stuff
export default const AviLib = {
	MathLive,
	formulasPart,
	MathInputField,
};
