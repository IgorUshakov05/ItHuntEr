const City = require('../models/city');
const findCity = async (req,res) => {
        const data = await JSON.parse(req.params.value)
    console.log(data)
    if (data.city) {

    const finded = await City.findOne(
        {
            name: data.country.trim(),
            "areas.name": data.oblast.trim(),
            "areas.areas.name": data.city.trim()
        },
        {
            _id: 0, // Исключаем поле _id из результата
            areas: {
                $elemMatch: {
                    name: data.oblast.trim(),
                    "areas.name": data.city.trim()
                }
            }
        }
    );
        console.log(finded)

    }
    else if(data.oblast) {
        const finded = await City.findOne(
            {
                name: data.country.trim(),
                "areas.name": data.oblast.trim(),
            },
            {
                _id: 0, // Исключаем поле _id из результата
                areas: {
                    $elemMatch: {
                        name: data.oblast.trim(),
                        "areas.name": data.city.trim()
                    }
                }
            }
        );
        console.log(finded)

    }
    else if(data.country) {
        const finded = await City.find({name: { $regex: '^' + data.country.trim(), $options: 'i' } }, { name: 1 })

        if (finded[0]) {
            res.json({country:finded[0].name})
            console.log(finded[0])
        }
        else {
            res.json({message:false})
        }
    }
    else {
        res.json({message:false})
    }
}

module.exports = findCity