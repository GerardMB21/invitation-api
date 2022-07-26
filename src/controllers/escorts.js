//models
const { Escorts } = require('../models/escorts');

//utils
const { catchAsync } = require('../utils/catchAsync');

//controllers
const create = catchAsync(async (req,res,next)=>{
    const { guest } = req;
    const { name } = req.body;


    const newEscort = await Escorts.create({
        name,
        guestId: guest.id
    });

    res.status(201).json({
        status: 'success',
        newEscort
    });
});

const deleted = catchAsync(async (req,res,next)=>{
    const { escort } = req;

    await escort.update({
        confirmation: false
    });

    res.status(200).json({
        status: 'success'
    });
});

const reActive = catchAsync(async (req,res,next)=>{
    const { escort } = req;

    await escort.update({
        confirmation: true
    });

    res.status(200).json({
        status: 'success'
    });
});

const getQuery = catchAsync(async (req,res,next)=>{
    const { confirmation } = req.query;

    const data = await Escorts.findAll({
        where: {
            confirmation
        }
    });

    if (!data.length) {
        return next(new AppError('Not guests exists',404));
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

module.exports = {
    create,
    deleted,
    reActive,
    getQuery,
};