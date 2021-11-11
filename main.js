const { setTimeout } = require('timers/promises')

const values = [true, false, true, false, true]

let started = []
let fulfilled = []
let rejected = []

async function main () {
  console.log('--- 1 started ---')

  const results1 = await Promise.all(values.map(async (v, idx) => {
    started.push(`1-${idx}`)
    await setTimeout(1000 * idx)
    if (v) {
      fulfilled.push(`1-${idx}`)
      return v
    }
    rejected.push(`1-${idx}`)
    throw new Error(`Error at ${idx}`)
  })).catch((e) => {
    // catched only 1 error
    console.error('error1: ', e.toString())
  })
  console.log('result1: ', results1) // <- undefined

  console.log('--- 1 ended ---') // 1000 * 1 sec later

  console.log('--- 2 started ---')

  const results2 = await Promise.allSettled(values.map(async (v, idx) => {
    started.push(`2-${idx}`)
    await setTimeout(1000 * idx)
    if (v) {
      fulfilled.push(`2-${idx}`)
      return v
    }
    rejected.push(`2-${idx}`)
    throw new Error(`Error at ${idx}`)
  }))
  // catched all errors
  console.error('error2: ', results2.filter((r) => r.status === 'rejected').map((r) => r.reason.toString()))
  // all fulfilled results
  console.log('result2: ', results2.filter((r) => r.status === 'fulfilled').map((r) => r.value))

  console.log('--- 2 ended ---') // 1000 * 4 sec later

  console.log('started', started)
  /*
   * started [
   *   '1-0', '1-1', '1-2',
   *   '1-3', '1-4', '2-0',
   *   '2-1', '2-2', '2-3',
   *   '2-4'
   * ]
   */
  console.log('fulfilled', fulfilled)
  /*
   * fulfilled [ '1-0', '2-0', '1-2', '2-2', '1-4', '2-4' ]
   */
  console.log('rejected', rejected)
  /*
   * rejected [ '1-1', '2-1', '1-3', '2-3' ]
   */
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
