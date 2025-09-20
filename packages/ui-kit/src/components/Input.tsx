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
        <label class="text-sm font-medium text-gray-300">
          {props.label}
        </label>
      </Show>
      <input
        class="px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        value={props.value}
        placeholder={props.placeholder}
        type={props.type || 'text'}
        disabled={props.disabled}
        onInput={props.onChange}
        onKeyPress={props.onKeyPress}
      />
      <Show when={props.error}>
        <span class="text-sm text-red-400">{props.error}</span>
      </Show>
    </div>
  );
};