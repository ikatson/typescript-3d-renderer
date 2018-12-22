type Props = {
    // onChange: Function,
    checked?: boolean,
    id?: string;
    type?: string,
    className?: string,
    for?: string,
    value?: number | string,
    min?: number,
    max?: number,
    step?: number,
    onChange?: Function,
}

type HTMLOrString = HTMLElement | string;
type Child = HTMLOrString | HTMLOrString[];
type RadioInputOption = {
    label: string,
    value: string,
}

const nextId = (() => {
    let id = 0;
    return () => {
        id++;
        return id;
    }
})()

export const c = (name: string) => { return { className: name } };

export const funcRef = (ref?: Function) => {
    const f = function () {
        if (f.ref) {
            f.ref.apply(null, arguments);
        }
    };
    f.ref = ref;
    return f;
}

export const e = (name: string, props: Props, ...children: HTMLOrString[]) => {
    const el = document.createElement(name);
    if (props) {
        el.className = props.className;
        if (props.id) {
            el.id = props.id;
        }
        if (props.type) {
            el.type = props.type;
        }
        if (props.value) {
            el.value = props.value;
        }
        if (props.min) {
            el.min = props.min;
        }
        if (props.max) {
            el.max = props.max;
        }
        if (props.step) {
            el.step = props.step;
        }
        if (props.for) {
            el.setAttribute('for', props.for);
        }
        if (props.onChange) {
            el.onchange = props.onChange;
        }
        if (props.checked) {
            el.checked = props.checked;
        }
    }
    children.map(c => {
        if (c instanceof Array) {
            c.map(c => {
                el.appendChild(c);
            })
        } else if (typeof c === 'string') {
            el.textContent = c;
        } else {
            el.appendChild(c);
        }
    })
    return el;
}

export const Form = (...children) => {
    return e('div', c('form'), ...children);
}

export const FormGroup = (label: string, ...children) => {
    return e('div', c('form-group'),
        e('label', null, label),
        ...children
    );
}

export const InputGroup = (...children) => {
    return e('div', c('input-group'), ...children);
}

export const NumberInput = (label: string, props: Props, onChange: (number) => void) => {
    return [
        e('div', c('input-group-prepend'),
            e('span', c('input-group-text'), label)
        ),
        e('input', {
            className: 'form-control',
            type: 'number',
            onChange: (ev) => {
                onChange(ev.target.value);
            },
            ...props
        }),
    ]
}

export const RadioInput = (options: RadioInputOption[], value: string, onChange: (string) => void) => {
    const id = nextId();
    return options.map(o => {
        const eid = nextId();
        return e('div', c('form-check'),
            e('input', {
                className: 'form-check-input',
                type: 'radio',
                id: eid.toString(),
                value: o.value,
                checked: o.value === value
            }),
            e('label', { className: 'form-check-label', for: eid.toString() }, o.label)
        )
    });
}