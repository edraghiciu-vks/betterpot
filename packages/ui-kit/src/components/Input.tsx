import { JSX, Show } from 'solid-js';

// Input component for SolidJS
interface InputProps {
  label?: string;
  error?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  onChange?: (e: Event) => void;
  onKeyPress?: (e: KeyboardEvent) => void;
  [key: string]: any;
}

export const Input = (props: InputProps) => {
  return (
    <div class="flex flex-col gap-1">
      <Show when={props.label}>
        <label class="text-sm font-medium" style={{'color': '#6b6450'}}>
          {props.label}
        </label>
      </Show>
      <input
        class="px-3 py-2 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          'background-color': '#f9f7f1',
          'border': '1px solid #e5dfce',
          'color': '#3d3929',
          'transition': 'border-color 0.2s, box-shadow 0.2s'
        }}
        value={props.value}
        placeholder={props.placeholder}
        type={props.type || 'text'}
        disabled={props.disabled}
        onInput={props.onChange}
        onKeyPress={props.onKeyPress}
        onFocus={(e) => {
          const target = e.target as HTMLElement;
          target.style.borderColor = '#b8860b';
          target.style.boxShadow = '0 0 0 2px rgba(184, 134, 11, 0.2)';
        }}
        onBlur={(e) => {
          const target = e.target as HTMLElement;
          target.style.borderColor = '#e5dfce';
          target.style.boxShadow = 'none';
        }}
      />
      <Show when={props.error}>
        <span class="text-sm" style={{'color': '#cd5c5c'}}>{props.error}</span>
      </Show>
    </div>
  );
};