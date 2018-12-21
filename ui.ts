// import * as React from "react";

const e = React.createElement;

const nextId = (() => {
    var id = 0;
    return () => {
        console.log('id+', id);
        id = id + 1;
        return `rid-${id}`;
    }
})()

export class Form extends React.Component {
    render() {
        return e('div', { className: 'form' }, this.props.children)
    }
}

export class FormGroup extends React.Component {
    render() {
        return e('div', { className: 'form-group' },
            this.props.label ? e('label', null, this.props.label) : null,
            this.props.children
        );
    }
}

export class InputGroup extends React.Component {
    render() {
        return e('div', { className: 'input-group' }, this.props.children);
    }
}

export class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        }
    }
    onChange(v) {
        this.props.onChange(v, this.state.value);
        this.setState({ value: v });
    }
    render() {
        return [
            e('div',
                { className: 'input-group-prepend', key: 'prepend' },
                e('div', { className: 'input-group-text' }, this.props.label)
            ),
            e('input', {
                key: 'input',
                type: 'number',
                className: 'form-control',
                value: this.state.value,
                min: this.props.min,
                step: this.props.step,
                max: this.props.max,
                onChange: ev => {
                    this.onChange(ev.target.value);
                }
            })
        ]
    }

    // <div class="input-group-prepend">
    //             <span class="input-group-text">Radius</span>
    //           </div>
    //           <input type="number" class="form-control" name="ssao-radius" value="2.0" min="0.001" step="0.1">
}

export class RadioInputValue extends React.Component {
    state: { current: any; };
    props: any;
    id: string;
    constructor(props) {
        super(props);
        this.state = {
            current: this.props.current,
        }
        this.id = nextId();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.current != this.props.current) {
            this.setState({ current: this.props.current });
        }
    }
    render() {
        return e('div', { className: 'form-check' },
            e('input', {
                className: 'form-check-input',
                type: 'radio',
                name: this.props.name,
                value: this.props.value,
                id: this.id,
                onChange: this.props.onChange,
                checked: this.isChecked(),
            }),
            e('label', { 'className': 'form-check-label', htmlFor: this.id }, this.props.label)
        )
    }

    private isChecked(): boolean {
        return this.state.current.toString() === this.props.value.toString();
    }
}

export class RadioInput extends React.Component {
    name: string;
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        }
        this.name = nextId();
    }
    onChange(ev) {
        const value = ev.target.value;
        this.setState({ value: value });
        if (this.props.onChange) this.props.onChange(value);
    }
    render() {
        return this.props.options.map(opt => {
            return e(RadioInputValue, {
                name: this.name,
                current: this.state.value,
                value: opt.value,
                label: opt.label,
                onChange: this.onChange.bind(this),
                key: opt.value
            });
        })
    }
}

export class CheckBoxInput extends React.Component {
    id: string;
    constructor(props) {
        super(props)
        this.state = {
            checked: this.props.checked,
        }
        this.id = nextId();
    }
    render() {
        e('div', { className: 'form-check' },
            e('div', {
                className: 'form-check-input', type: 'checkbox',
                checked: this.state.checked,
                onChange: ev => {
                    const value = ev.target.checked;
                    if (this.props.onChange) {
                        this.props.onChange(value)
                    }
                    this.setState({checked: value})
                },
                id: this.id,
            }),
            e('label', {className: 'form-check-label', htmlFor: this.id}, this.props.label)
        )
    }
}


export function makeFunctionReference() {
    const call = function () {
        if (call.ref) {
            return call.ref.apply(null, arguments);
        }
    }
    call.ref = null;
    call.updateRef = (f: Function) => {
        call.ref = f;
    }
    return call;
}