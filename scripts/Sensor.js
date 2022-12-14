import { lerp, getIntercection } from './utils.js'

export default class Sensor {
  constructor(car) {
    this.car = car
    this.rayCount = 7
    this.rayLength = 150
    this.raySpread = Math.PI / 1.5
    this.rays = []
    this.readings = []
  }

  update(roadBorders, traffic) {
    this.#castRays()
    this.readings = []
    for (const ray of this.rays) {
      this.readings.push(this.#getReading(ray, roadBorders, traffic))
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      const ray = this.rays[i]
      let end = ray[1]
      if (this.readings[i]) {
        end = this.readings[i]
      }

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'yellow'
      ctx.moveTo(ray[0].x, ray[0].y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'black'
      ctx.moveTo(ray[1].x, ray[1].y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }
  }

  #castRays() {
    this.rays = []
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle

      const start = { x: this.car.x, y: this.car.y }
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }

      this.rays.push([start, end])
    }
  }

  #getReading(ray, roadBorders, traffic) {
    const touches = []

    for (const border of roadBorders) {
      const touch = getIntercection(ray[0], ray[1], border[0], border[1])
      if (touch) {
        touches.push(touch)
      }
    }

    for (const trafficCar of traffic) {
      const poly = trafficCar.polygon
      for (let i = 0; i < poly.length; i++) {
        const touch = getIntercection(
          ray[0],
          ray[1],
          poly[i],
          poly[(i + 1) % poly.length]
        )

        if (touch) {
          touches.push(touch)
        }
      }
    }

    if (touches.length === 0) {
      return null
    } else {
      const offsets = touches.map((touch) => touch.offset)
      const minOffset = Math.min(...offsets)
      return touches.find((touch) => touch.offset === minOffset)
    }
  }
}
