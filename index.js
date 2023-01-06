import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import mysql from 'mysql'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Encrypted@098',
    database:'employeedb'
});

mysqlConnection.connect((err) =>{
    if(!err){
        console.log("Connection to database successfull!!")
    }
    else{
        console.log(err.message)
    }
})


app.listen(4000,() =>{
    console.log("Server starting at port 4000!")
})

// GET ALL EMPLOYEESS FROM THE MYSQL-DATABASE


app.get('/employees',(req,res)=>{
    mysqlConnection.query('select * from employee', (err,rows,fields)=>{
        if(!err){
            console.log(rows);
        }
        else{
            console.log(err);
        }
    })
})

// GET EMPLOYEE FROM SPECIFIC IDS
app.get('/employees/:id',(req,res)=>{
    mysqlConnection.query('select * from employee where empid = ?',[req.params.id], (err,rows,fields)=>{
        if(!err){
            console.log(rows);
        }
        else{
            console.log(err);
        }
    })
})

//DELETE A SPECIFIC EMPLOYEE FROM ITS EMP ID
app.delete('/employees/:id',(req,res)=>{

    mysqlConnection.query('Delete employee where empid = ?',[req.params.id], (err,rows,fields)=>{
        if(!err){
            console.log('Deleted Sucessfully!!');
        }
        else{
            console.log(err);
        }
    })
})

// ADD AN EMPLOYEE  
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].EmpID);
            });
        else
            console.log(err);
    })
});


//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});