import {rgbToHex} from "./utils";

type Props = {
    // onChange: Function,
    checked?: boolean,
    id?: string;
    name?: string;
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
    value: string | number,
}

const nextId = (() => {
    let id = 0;
    return () => {
        id++;
        return id;
    }
})()

export const c = (name: string) => { return { className: name } };

export const funcRef: Function = (ref?: Function) => {
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
        for (const k in props) {
            if (!props.hasOwnProperty(k)) {
                continue;
            }
            const v = props[k];
            switch (k) {
                case 'for':
                    el.setAttribute('for', props.for);
                    break;
                case 'onChange':
                    el.onchange = v;
                    break;
                default:
                    el[k] = v;
            }
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

export const FormRow = (...children) => {
    return e('div', c('form-row'), ...children);
}

/**
 * @deprecated
 */
export const InputGroup = (...children) => {
    // return e('div', c('input-group input-group-sm'), ...children);
    return children;
}

export const NumberInput = (label: string, props: Props, onChange: (number) => void) => {
    return e('div', c('input-group input-group-xs'),
        e('div', c('input-group-prepend'),
            e('span', c('input-group-text'), label)
        ),
        e('input', {
            ...props,
            className: 'form-control',
            type: 'number',
            onChange: (ev) => {
                props.value = ev.target.value;
                onChange(ev.target.value);
            },
        }),
    )
};

export const SliderInput = (label: string, props: Props, onChange: (number) => void) => {
    const id = nextId();
    return [
        e('label', {for: id.toString()}, label),
        e('input', {
            ...props,
            className: 'form-control-range',
            type: 'range',
            id: id.toString(),
            onChange: (ev) => {
                props.value = ev.target.value;
                onChange(ev.target.value);
            },
        }),
    ]
};


export const ColorInput = (label: string, props: Props, onChange: (string) => void) => {
    const valueLabel = e('div', c('color-label'), props.value.toString());
    return e('div', c('input-group input-group-xs'),
        e('div', c('input-group-prepend'),
            e('span', c('input-group-text'), label)
        ),
        e('input', {
            ...props,
            className: 'form-control',
            type: 'color',
            onChange: (ev) => {
                const v = ev.target.value;
                props.value = v;
                valueLabel.textContent = v;
                onChange(v);
            },
        }),
        valueLabel
    )
};

export const RadioInput = (options: RadioInputOption[], props: Props, onChange: (string) => void) => {
    const id = nextId();
    return options.map(o => {
        const eid = nextId();
        return e('div', c('form-check'),
            e('input', {
                className: 'form-check-input',
                name: id.toString(),
                type: 'radio',
                id: eid.toString(),
                value: o.value,
                checked: o.value === props.value,
                onChange: (ev) => {
                    props.value = ev.target.value;
                    onChange(ev.target.value);
                }
            }),
            e('label', { className: 'form-check-label', for: eid.toString() }, o.label)
        )
    });
}

export const CheckBoxInput = (label: string, props: Props, onChange: (boolean) => void) => {
    const id = nextId();
    return e('div', c('form-check'),
        e('input', {
            ...props,
            className: 'form-check-input',
            type: 'checkbox',
            id: id.toString(),
            onChange: (ev) => {
                props.checked = ev.target.checked;
                onChange(ev.target.checked)
            }
        }),
        e('label', {className: 'form-check-label', for: id.toString()}, label)
    )
}
