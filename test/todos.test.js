const { ObjectId } = require("mongodb")
const request = require("supertest")
const app = require("../src/app")
const { connectToDB, closeConnection, getDB } = require("../src/database")

const baseUrl = "/todos"
let db

beforeAll(async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    const MONGODB_DB = process.env.MONGODB_DB || 'mytodos-test'

    await connectToDB(MONGODB_URI, MONGODB_DB)
    console.log(MONGODB_URI)
})

afterAll(async () => {
    closeConnection()
})
afterEach(async()=>{
    db=getDB()
    await db.dropCollection("todos")
})

beforeEach(async () => {
    db=getDB()
    await db.createCollection("todos")
})


describe("GET /todos", () => {
    test("should respond with a 200 status code", async () => {
        const response= await request(app.callback()).get(baseUrl)
        expect(response.statusCode).toBe(200)
       
    })

    test("should respond with JSON", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.type).toBe("application/json")
        
    })

    test("should respond with list of existing todos", async () => {
       
           const todo1={
           tilte: "Todo 1",
           completed: false,
           createdAt: new Date(2022, 2, 2),
           updatedAt: new Date(2022, 2, 3)
       };
        const todo2={
           tilte: "Todo 2",
           completed: true,
           createdAt: new Date(2022, 2, 2),
           updatedAt: new Date(2022, 2, 3)
       };
        await inserttodo(todo1)
        await inserttodo(todo2)
        const response = await request(app.callback()).get(baseUrl)
        
       expect( response.type).toBe("application/json")
        expect(response.body).toMatchObject([todo1,todo2])
        
           
    })
});

describe("POST/todos",() =>{
    const Data={title: "Todo 1"};
    const missingData={};
    const invalidData={title:null};
    
    test("should respond with a 200 status code", async () => {
        const response = await request(app.callback()).post(baseUrl).send(Data)
        expect(response.statusCode).toBe(200)
        expect(response.body.id.length).toBe(24)
        
        
    })
    
    test("should respond with a 422 status code (no todo title)", async () => {
        const response= await request(app.callback()).post(baseUrl).send(missingData)
        expect(response.statusCode).toBe(422)
        expect(response.body.errorMsg).toBe("Missing parameter 'title'")
    })
    
    test("should respond with a 400 status code if 'title' param is invalid", async () => {
        const response = await request(app.callback()).post(baseUrl).send(invalidData)
        expect(response.statusCode).toBe(400)
        expect(response.body.errorMsg).toBe("Invalidparameter 'title'")
    });
   
describe("DELETE/todos",()=>{
         test("should respond with a 200 status code", async () =>{
    const response =await request(app.callback()).delete(baseUrl).send(todo1)
    })
});
asyn function inserttodo(todo){
const db =getDB()
await db.collection("todos").insertOne(todo)
}