import faker from 'faker'
import RandExp from 'randexp'
import moment from 'moment'
faker.locale = 'zh_CN'

const randomGenerator = {
  number: randomNumber,
  phone: randomPhone,
  zip: randomZip,
  city: randomCity,
  img: randomImg,
  email: randomEmail,
  url: randomUrl,
  name: randomName,
  color: randomColor,
  text: randomText,
  money: randomMoney,
  date: randomDate,
  time: randomTime,
  timestamp: randomTimestamp,
  line: randomLine,
}

type RandomKey = keyof typeof randomGenerator

const typesList = Object.keys(randomGenerator)

/**
 *
 * @param n random number long
 */
function randomNumber(n = 6): number {
  return randomNumberWithExactLong(n)
}

function randomPhone() {
  return createRandomFromRegExp(/1[3-9]\d{9}/)
}

function randomZip() {
  return createRandomFromRegExp(/[1-9][0-9]{5}/)
}

function randomCity() {
  return faker.address.city()
}

function randomImg() {
  return faker.image.image()
}

function randomEmail() {
  return faker.internet.email()
}

function randomUrl() {
  return faker.internet.url()
}

function randomName() {
  return faker.name.lastName()
}
function randomColor() {
  return faker.commerce.color()
}

function randomText() {
  return faker.lorem.word()
}

function randomMoney(sign = '$') {
  return sign + ' ' + createRandomFromRegExp(/[1-9][0-9]{1,3}(,[0-9]{3}){0,3}(\.[1-9][1-9])?/)
}

/**
 *
 * @param day random day picker range, from how many day before
 * @param format output date format
 */

function randomDate(day = 60, format = 'YYYY-MM-DD') {
  return moment(randomTimestamp(day)).format(format)
}

function randomTime(day = 60, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(randomTimestamp(day)).format(format)
}

function randomTimestamp(day = 60): number {
  const _distance = day * 24 * 60 * 60 * 1000
  const _end = Date.now()
  const _start = _end - _distance
  return createNumber(_distance) + _start
}

/**
 *
 * @param min minimum number of characters
 * @param max maximum number of characters
 */
function randomLine(min = 20, max = 30): string {
  let _text = faker.lorem.words()
  for (; _text.length < min;) {
    _text += faker.lorem.words().substring(0, max)
  }
  return _text
}

function randomNumberWithExactLong(n: number): number {
  return (createNumber(8.99) + 1) * Math.pow(10, n - 1) + createNumber(Math.pow(10, n - 1) - 1)
}

function createNumber(number: number): number {
  return Math.floor(Math.random() * number)
}

function createRandomFromRegExp(reg: RegExp): any {
  return new RandExp(reg).gen()
}

export function generateRandom(type: RandomKey, ...format: any) {
  if (!typesList.includes(type)) {
    console.warn(`current random type '${type}' not found, only these type are agree: ${typesList}`)
    return ''
  }
  const randomFn: any = randomGenerator[type]

  return randomFn(...format)
}
