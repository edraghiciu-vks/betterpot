# SolidJS Framework Guide

## 🎯 What is SolidJS?

SolidJS is a modern JavaScript framework for building responsive and high-performing user interfaces. It embraces **fine-grained reactivity** - updating only what has changed rather than re-rendering entire component trees like React.

### Key Advantages
- **Performant**: Fine-grained reactivity = faster load times and smoother performance
- **No Virtual DOM**: Direct DOM updates without intermediate layers
- **Small Bundle Size**: 6KB vs React's 42KB
- **Familiar Syntax**: JSX-based with React-like patterns
- **True Reactivity**: Uses signals for automatic dependency tracking

## 🔧 Core Concepts

### 1. Signals - The Foundation of Reactivity

Signals are the primary reactive primitive in SolidJS. They consist of a **getter**, **setter**, and **value**.

```tsx
import { createSignal } from 'solid-js';

// Basic signal
const [count, setCount] = createSignal(0);

// Reading the value (note the function call)
console.log(count()); // 0

// Setting the value
setCount(5);
console.log(count()); // 5

// Derived signals
const [firstName, setFirstName] = createSignal('John');
const [lastName, setLastName] = createSignal('Doe');

// Computed value (derived signal)
const fullName = () => `${firstName()} ${lastName()}`;
```

### 2. Effects - Reactive Side Effects

Effects automatically run when their dependencies change.

```tsx
import { createSignal, createEffect } from 'solid-js';

const [count, setCount] = createSignal(0);

// Effect runs whenever count changes
createEffect(() => {
  console.log('Count is now:', count());
});

setCount(10); // Logs: "Count is now: 10"
```

### 3. Resources - Async Data Management

Resources handle async operations with built-in loading states.

```tsx
import { createResource, createSignal } from 'solid-js';

const [userId, setUserId] = createSignal(1);

// Fetcher function
const fetchUser = async (id: number) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// Create resource
const [user] = createResource(userId, fetchUser);

// Usage in component
function UserProfile() {
  return (
    <div>
      {user.loading && <p>Loading...</p>}
      {user.error && <p>Error: {user.error.message}</p>}
      {user() && <p>User: {user().name}</p>}
    </div>
  );
}
```

### 4. Stores - Complex State Management

For more complex state, use stores instead of signals.

```tsx
import { createStore } from 'solid-js/store';

const [user, setUser] = createStore({
  profile: {
    name: 'John',
    email: 'john@example.com'
  },
  preferences: {
    theme: 'dark',
    notifications: true
  }
});

// Update nested properties
setUser('profile', 'name', 'Jane');
setUser('preferences', prev => ({ ...prev, theme: 'light' }));
```

## 🏗️ Components and JSX

### Basic Component Structure

```tsx
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;
```

### Props and Component Communication

```tsx
import { JSX } from 'solid-js';

interface ButtonProps {
  children: JSX.Element;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button(props: ButtonProps) {
  return (
    <button
      class={`btn btn-${props.variant || 'primary'}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

// Usage
function App() {
  const handleClick = () => console.log('Clicked!');
  
  return (
    <Button onClick={handleClick} variant="secondary">
      Click me
    </Button>
  );
}
```

## 🔄 Control Flow Components

SolidJS provides specialized components for control flow that optimize rendering.

### Show - Conditional Rendering

```tsx
import { Show, createSignal } from 'solid-js';

function UserStatus() {
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(false);

  return (
    <div>
      <Show when={loading()}>
        <p>Loading...</p>
      </Show>
      
      <Show when={user()} fallback={<p>Please log in</p>}>
        <p>Welcome, {user().name}!</p>
      </Show>
    </div>
  );
}
```

### For - Efficient List Rendering

```tsx
import { For, createSignal } from 'solid-js';

function TodoList() {
  const [todos, setTodos] = createSignal([
    { id: 1, text: 'Learn SolidJS', completed: false },
    { id: 2, text: 'Build an app', completed: false }
  ]);

  return (
    <ul>
      <For each={todos()}>
        {(todo, i) => (
          <li class={todo.completed ? 'completed' : ''}>
            {i() + 1}. {todo.text}
          </li>
        )}
      </For>
    </ul>
  );
}
```

### Index - Alternative List Rendering

Use `Index` when working with primitive values or when the array length changes frequently.

```tsx
import { Index, createSignal } from 'solid-js';

function NumberList() {
  const [numbers, setNumbers] = createSignal([1, 2, 3, 4, 5]);

  return (
    <ul>
      <Index each={numbers()}>
        {(number, i) => (
          <li>Position {i}: {number()}</li>
        )}
      </Index>
    </ul>
  );
}
```

### Switch & Match - Multiple Conditions

```tsx
import { Switch, Match, createSignal } from 'solid-js';

function StatusIndicator() {
  const [status, setStatus] = createSignal<'loading' | 'success' | 'error'>('loading');

  return (
    <Switch fallback={<div>Unknown status</div>}>
      <Match when={status() === 'loading'}>
        <div class="spinner">Loading...</div>
      </Match>
      <Match when={status() === 'success'}>
        <div class="success">✅ Success!</div>
      </Match>
      <Match when={status() === 'error'}>
        <div class="error">❌ Error occurred</div>
      </Match>
    </Switch>
  );
}
```

## 🎭 Event Handling

SolidJS uses standard DOM events with some enhancements.

```tsx
import { createSignal } from 'solid-js';

function EventExample() {
  const [message, setMessage] = createSignal('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setMessage(formData.get('message') as string);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="message" type="text" placeholder="Enter message" />
      <button type="submit">Submit</button>
      <p>Message: {message()}</p>
    </form>
  );
}
```

## 🔧 Lifecycle and Effects

### onMount - Component Initialization

```tsx
import { onMount, createSignal } from 'solid-js';

function DataComponent() {
  const [data, setData] = createSignal(null);

  onMount(async () => {
    const response = await fetch('/api/data');
    const result = await response.json();
    setData(result);
  });

  return <div>{data() ? data().title : 'Loading...'}</div>;
}
```

### onCleanup - Resource Cleanup

```tsx
import { onMount, onCleanup, createSignal } from 'solid-js';

function Timer() {
  const [seconds, setSeconds] = createSignal(0);

  onMount(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    onCleanup(() => clearInterval(interval));
  });

  return <div>Seconds: {seconds()}</div>;
}
```

## 🎨 Styling and CSS

### Class Binding

```tsx
import { createSignal } from 'solid-js';

function StyledComponent() {
  const [isActive, setIsActive] = createSignal(false);

  return (
    <div
      class={isActive() ? 'active' : 'inactive'}
      classList={{
        'btn': true,
        'btn-primary': isActive(),
        'btn-secondary': !isActive()
      }}
      onClick={() => setIsActive(!isActive())}
    >
      Toggle me
    </div>
  );
}
```

### Style Binding

```tsx
import { createSignal } from 'solid-js';

function DynamicStyles() {
  const [color, setColor] = createSignal('red');
  const [size, setSize] = createSignal(16);

  return (
    <div
      style={{
        color: color(),
        'font-size': `${size()}px`,
        padding: '10px'
      }}
    >
      Dynamic styling
    </div>
  );
}
```

## 🏪 Context and Global State

### Creating Context

```tsx
import { createContext, useContext, JSX } from 'solid-js';
import { createStore } from 'solid-js/store';

interface AuthContextType {
  user: () => User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## 🧪 Testing Components

### Basic Component Testing with Vitest

```tsx
import { render, screen } from 'solid-testing-library';
import { test, expect } from 'vitest';
import Counter from './Counter';

test('renders counter with initial value', () => {
  render(() => <Counter initialValue={5} />);
  
  expect(screen.getByText('Count: 5')).toBeInTheDocument();
});

test('increments counter on button click', async () => {
  render(() => <Counter />);
  
  const button = screen.getByText('Increment');
  const user = userEvent.setup();
  
  await user.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## 🚀 Performance Best Practices

### 1. Signal Granularity
```tsx
// ❌ Avoid large objects in signals
const [state, setState] = createSignal({
  user: {...},
  posts: [...],
  comments: [...]
});

// ✅ Split into focused signals
const [user, setUser] = createSignal(null);
const [posts, setPosts] = createSignal([]);
const [comments, setComments] = createSignal([]);
```

### 2. Avoid Unnecessary Derivations
```tsx
// ❌ Creates unnecessary reactivity
const expensiveComputation = () => {
  return posts().map(post => ({
    ...post,
    commentsCount: comments().filter(c => c.postId === post.id).length
  }));
};

// ✅ Use createMemo for expensive computations
const expensiveComputation = createMemo(() => {
  return posts().map(post => ({
    ...post,
    commentsCount: comments().filter(c => c.postId === post.id).length
  }));
});
```

### 3. Batch Updates
```tsx
import { batch } from 'solid-js';

// ❌ Multiple signal updates trigger multiple effects
setFirstName('John');
setLastName('Doe');
setAge(30);

// ✅ Batch updates for better performance
batch(() => {
  setFirstName('John');
  setLastName('Doe');
  setAge(30);
});
```

## 🌟 Integration with Betterpot Project

### Example: Music Player Component

```tsx
import { createSignal, createEffect, Show } from 'solid-js';
import { useAudio } from '../stores/player';

interface Track {
  id: string;
  title: string;
  artist: string;
  preview_url: string;
}

function MusicPlayer() {
  const { currentTrack, isPlaying, setIsPlaying } = useAudio();
  const [duration, setDuration] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);

  createEffect(() => {
    if (currentTrack()) {
      console.log('Now playing:', currentTrack().title);
    }
  });

  const togglePlayback = () => {
    setIsPlaying(!isPlaying());
  };

  return (
    <div class="music-player">
      <Show when={currentTrack()} fallback={<p>No track selected</p>}>
        <div class="track-info">
          <h3>{currentTrack().title}</h3>
          <p>{currentTrack().artist}</p>
        </div>
        
        <div class="controls">
          <button onClick={togglePlayback}>
            {isPlaying() ? '⏸️' : '▶️'}
          </button>
        </div>
        
        <div class="progress">
          <span>{Math.floor(currentTime())}</span>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              style={{ width: `${(currentTime() / duration()) * 100}%` }}
            />
          </div>
          <span>{Math.floor(duration())}</span>
        </div>
      </Show>
    </div>
  );
}

export default MusicPlayer;
```

## 📚 Additional Resources

- **Official Docs**: https://docs.solidjs.com
- **Playground**: https://playground.solidjs.com
- **Tutorial**: https://www.solidjs.com/tutorial
- **Community**: https://discord.com/invite/solidjs

## 🔗 Betterpot-Specific Patterns

When building components for the Betterpot music player:

1. **Use signals for audio state**: current track, playback position, volume
2. **Leverage createResource**: for API calls to Beatport
3. **Implement Show/For components**: for conditional track lists and search results
4. **Context for global state**: auth, player state, library management
5. **Effects for audio events**: track changes, progress updates, error handling

This guide provides the foundation for building reactive, performant UI components in the Betterpot music player application.