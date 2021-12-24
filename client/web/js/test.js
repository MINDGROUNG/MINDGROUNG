import commonUtil from '../../../util/commonUtil'

const testFunc = () => {
    return 'hi'
}
const arrayList = [1,2,3,4,5,6,7,8]
console.log(testFunc())
console.log(arrayList.includes(1),123123)


const object1 = [
    {
      a: 'somestring',
      b: 42,
      c: false
    },
    {
        a: 'somestring',
        b: 45,
        c: false
    },
    {
        a: 'somestring',
        b: 49,
        c: true
    },
    {
        a: 'somestring',
        b: 42,
        c: false
    }
];
for(let i = 0; i < object1.length; i++)
{
    if(Object.values(object1[i])[2]==false)
    {
        console.log(object1[i])
    }
}

let self = commonUtil.makeid(15)
console.log(self,'asdsadasd')