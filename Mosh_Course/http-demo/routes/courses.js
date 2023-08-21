const Joi = require('joi');
const express= require('express');
const router= express.Router();




const courses = [
    {id: 1, name: 'course 1'},
    {id: 2, name: 'course 2'},
    {id: 3, name: 'course 3'}
];

router.get('/', (req, res) => {
    res.send(courses);
});

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not available');
    res.send(course);
})

router.post('/', (req, res) => {
    
    const result = validateCourse(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
        // w/o Joi
    // if(!req.body.name || req.body.name.length < 3){
    //     res.status(400).send('name required and should be more than 3 char');
    //     return;
    // }


    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

router.put('/:id', (req, res) => {
    //Look up the course
    //If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('The course with the given ID does not exists');
    }

    //Validate
    const result = validateCourse(req.body);
    
    //If invalid, return 404
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    //Update course
    course.name= req.body.name;
    //Return the update course
    res.send(course);

});

router.delete('/:id', (req, res) => {
    //Look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send('The course with the given ID does not exists');
    }
    //Delete
    const index= courses.indexOf(course);
    courses.splice(index, 1);

    //Return the same 
    res.send(course);
});

router.get('/:year/:month', (req, res) => {
    res.send([req.query]);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

module.exports = router;