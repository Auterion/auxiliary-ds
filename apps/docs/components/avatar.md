# Avatar

A compound image-with-fallback built on Reka UI's `AvatarRoot` and styled by the `avatar` recipe. `Avatar` is the circular container; `AvatarImage` loads the photo; `AvatarFallback` renders initials (or an icon) while the image loads or if it fails.

<div class="auxiliary-demo">
  <Avatar size="sm"><AvatarFallback>YD</AvatarFallback></Avatar>
  <Avatar size="md"><AvatarFallback>AM</AvatarFallback></Avatar>
  <Avatar size="lg"><AvatarFallback>OP</AvatarFallback></Avatar>
</div>

## When to use

- To represent a **person or account** — a pilot, an operator, a team member in a list or header.
- When you have a profile photo but need a **graceful degradation** path: `AvatarImage` shows the photo, `AvatarFallback` shows initials if the image is missing, slow, or 404s.
- In dense lists (assignees, activity feeds, member rosters) where a small circular identity marker reads faster than a name.

## When *not* to use

- For **brand or product logos** — those aren't people. Render an `<img>` or icon directly; the circular crop and initials fallback are person semantics.
- As a **clickable target on its own** — Avatar is presentational. If it opens a menu or profile, wrap it in a `<Button>` or `DropdownMenu` trigger that carries the role, label, and focus ring.
- For **status indication** — an avatar is identity, not state. Pair it with a `<StatusBadge>` if you need to show "online / offline," don't tint the avatar itself.

## Examples

### Initials fallback

The most common case: no photo, just initials. `AvatarFallback` centers and uppercases its slot content. It needs `AvatarRoot` context, so it always lives inside `<Avatar>`.

<div class="auxiliary-demo">
  <Avatar size="sm"><AvatarFallback>YD</AvatarFallback></Avatar>
  <Avatar size="md"><AvatarFallback>AM</AvatarFallback></Avatar>
  <Avatar size="lg"><AvatarFallback>OP</AvatarFallback></Avatar>
</div>

```vue
<Avatar size="sm"><AvatarFallback>YD</AvatarFallback></Avatar>
<Avatar size="md"><AvatarFallback>AM</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>OP</AvatarFallback></Avatar>
```

### Image with fallback

Compose both children: `AvatarImage` paints the photo when it loads, `AvatarFallback` covers the gap until then (and stays if the load fails). This is the resilient default — never ship an `AvatarImage` without a fallback.

<div class="auxiliary-demo">
  <Avatar size="lg">
    <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Ava Mercer" />
    <AvatarFallback>AM</AvatarFallback>
  </Avatar>
  <Avatar size="lg">
    <AvatarImage src="https://broken.example/none.png" alt="Owen Park" />
    <AvatarFallback>OP</AvatarFallback>
  </Avatar>
</div>

```vue
<Avatar size="lg">
  <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Ava Mercer" />
  <AvatarFallback>AM</AvatarFallback>
</Avatar>

<!-- Broken src → the fallback takes over -->
<Avatar size="lg">
  <AvatarImage src="https://broken.example/none.png" alt="Owen Park" />
  <AvatarFallback>OP</AvatarFallback>
</Avatar>
```

### Sizes

Three sizes track the recipe: `sm` (24 px), `md` (32 px, default), `lg` (40 px). The text scale of the fallback scales with the container.

<div class="auxiliary-demo">
  <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
  <Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar>
  <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
</div>

```vue
<Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
<Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
```

### Delaying the fallback

`AvatarFallback` accepts `delayMs` — it waits that long before showing, so a fast-loading image never flashes initials first. Use a small delay (~150 ms) when most users have the image cached; use `0` when you'd rather show initials immediately.

<div class="auxiliary-demo">
  <Avatar size="lg">
    <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Mira Osei" />
    <AvatarFallback :delay-ms="150">MO</AvatarFallback>
  </Avatar>
</div>

```vue
<Avatar size="lg">
  <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Mira Osei" />
  <AvatarFallback :delay-ms="150">MO</AvatarFallback>
</Avatar>
```

## Props

### Avatar

<PropsTable name="Avatar" />

### AvatarImage

<PropsTable name="AvatarImage" />

### AvatarFallback

<PropsTable name="AvatarFallback" />

## Accessibility

- The **alt text lives on `AvatarImage`**. Pass `alt` with the person's name (`alt="Ava Mercer"`) so screen readers announce identity, not "image." When `alt` is omitted it defaults to an empty string, which marks the image decorative — correct only when an adjacent visible name already carries the meaning.
- `AvatarFallback` content is plain text and is read as-is. Initials alone ("AM") are terse for a screen reader; prefer a real name on the image, and treat the fallback as the visual stand-in.
- Reka UI swaps image and fallback based on the image's **load state** — the fallback shows while loading and on error, then yields to the image once it decodes. `delayMs` only gates the *initial* appearance of the fallback to avoid a flash on fast loads; it never blocks the image.
- Avatar renders no interactive role of its own. If it acts as a button or link, wrap it in a real `<Button>`/`<a>` so it gets keyboard focus, a focus ring, and an accessible name — don't attach `@click` to the bare Avatar.
