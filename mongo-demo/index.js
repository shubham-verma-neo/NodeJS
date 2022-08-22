const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('connected..'))
    .catch(err => console.error('not connected....', err));

const courseSchema= new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

const Course= mongoose.model('Course', courseSchema);


async function createCourse(){

    const course= new Course({
        name: 'Blockcahin',
        author: 'Shubham',
        tags: ['blockchain', 'crypto'],
        isPublished: true
    });
    const result = await course.save();
    console.log(result);

}

// createCourse();

async function getCourses(){
    const courses= await Course
        // .find({price: { $gt : 10} } ) //price greater than
        // .find() //logical operator
        // .or( [ { author: 'Shubham' }, { isPublished: true } ] )

        // .find( { author: /^Shubham/ } )   // start with Shubham case-sensitive
        // .find( { author: /Verma$/ } )   // ends with Verma case-sensitive

        // .find( { author: /^Shubham/i } )   // start with Shubham not case-sensitive
        // .find( { author: /Verma$/i } )   // ends with Verma not case-sensitive
        
    // .find( { author: /.*Shubham.*/ } )   // contains word Shubham

        .find({author: 'Shubham'})
        .limit(10)
        .sort({name: 1})
        .select({name: 1, tags: 1});
        // .count(); gives us query related total documents counts
    console.log(courses);
}

getCourses();