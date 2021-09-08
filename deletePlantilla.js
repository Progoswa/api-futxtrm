const Plantilla = require('./models/plantilla')

var moment = require('moment');

module.exports = (createAdmin = async()=>{
    
    setInterval(()=>{
        
        last7 = moment().subtract(7,'day')

        var start = moment(last7).startOf('day');
        // end today
        var end = moment(last7).endOf('day');
        
        
        
        Plantilla.updateMany({fecha:{ $gte: start, $lte: end },borrado:false},{$set:{borrado:true}})
            .exec((err,plantillas)=>{
               
            })

    },1000*60*60*24)

  
    
})()