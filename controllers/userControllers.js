const UserService = require('../services/userService');
const { registerSchema, loginSchema, otpSchema, updateUserSchema } = require('../validations/userValidation');

exports.register = async (req,res)=>{
  try{
    const { error } = registerSchema.validate(req.body);
    if(error) return res.status(400).json({ success:false, message:error.details[0].message });

    const user = await UserService.registerUser(req.body);
    res.status(201).json({ success:true, user });
  } catch(err){ res.status(400).json({ success:false, message:err.message }); }
};

exports.verifyOtp = async (req,res)=>{
  try{
    const { error } = otpSchema.validate(req.body);
    if(error) return res.status(400).json({ success:false, message:error.details[0].message });

    const result = await UserService.verifyOtp(req.body);
    res.status(200).json({ success:true, message:result.message });
  } catch(err){ res.status(400).json({ success:false, message:err.message }); }
};

exports.login = async (req,res)=>{
  try{
    const { error } = loginSchema.validate(req.body);
    if(error) return res.status(400).json({ success:false, message:error.details[0].message });

    const result = await UserService.loginUser(req.body);
    res.status(200).json({ success:true, ...result });
  } catch(err){ res.status(400).json({ success:false, message:err.message }); }
};

// Protected routes
exports.getUserById = async (req,res)=>{
  try{
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json({ success:true, user });
  } catch(err){ res.status(400).json({ success:false, message:err.message }); }
};

exports.getAllUsers = async (req,res)=>{
  try{
    const users = await UserService.getAllUsers();
    res.status(200).json({ success:true, users });
  } catch(err){ res.status(400).json({ success:false, message:err.message }); }
};

exports.updateUser = async (req,res)=>{
  try{
    const { error } = updateUserSchema.validate(req.body);
    if(error) return res.status(400).json({ success:false, message:error.details[0].message });

    const user = await UserService.updateUser(req.params.id, req.body);
    res.status(200).json({ success:true, user });
  } catch(err){ res.status(400).json({ success:false, message:err.message }); }
};
