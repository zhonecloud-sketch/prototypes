```js
const crowd = new ArticulatedCrowd(THREE, scene);
crowd.setCount(points.length, viewportAspect);
crowd.moveTo(points);
crowd.update(deltaSeconds, pace, true);
```

People walk to their assigned targets at individual, bounded speeds. Short
trips finish earlier than long trips. `crowd.moving` becomes `false` only
after everyone arrives; idle poses can continue without moving the target
positions. These behaviors are checked in `tests/app.test.mjs`.

`crowd.mjs` exports `ArticulatedCrowd`. The caller supplies the loaded
Three.js module and a scene. The class owns five instanced meshes, their
shared geometries and two materials. See `crowd.mjs`.

- `setCount(count, aspect)`: allocate `count` people, preserving existing
  people.
- `moveTo(points, immediate = false)`: assign one `{ x, z }` target per
  person, optionally placing everyone immediately.
- `finish()`: place everyone at their assigned target in a neutral pose.
- `update(delta, pace = 1, idle = true)`: advance time and poses; return
  whether anyone is still travelling.
- `dispose()`: remove meshes and release all owned graphics resources.

`delta` is elapsed time in seconds. `pace` uses the UI's range of 0.6 to 1.8
and adjusts desired walking speed within a cap of 1.65 times body height per
second. Acceleration and slowing near destinations avoid constant-speed
starts and stops. The walking cycle follows actual distance travelled; a
straight stance leg keeps one foot on the floor. See `crowd.mjs:166` and the
walking checks in `tests/app.test.mjs`.

Pass `immediate = true` when reduced motion is requested. Pass `idle = false`
to suppress breathing, head turns and relaxed arm movements. To pause,
stop calling `update`. Check `crowd.moving` for travel completion, rather
than stopping all updates: idle movement requires further updates. See
`app.mjs` for the animation scheduler and reduced-motion handling.
