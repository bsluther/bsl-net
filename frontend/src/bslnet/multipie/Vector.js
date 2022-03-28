const Vector = x => y => ({ x, y })
const vectorAdd = v1 => v2 => Vector(v1.x + v2.x)(v1.y + v2.y)

const xComponent = radians => radius =>
  Math.cos(radians) * radius

const yComponent = radians => radius =>
  Math.sin(radians) * radius

const calcCircleVector = radians => radius =>
  Vector(xComponent(radians)(radius))
        (yComponent(radians)(radius))

export { Vector, vectorAdd, calcCircleVector }