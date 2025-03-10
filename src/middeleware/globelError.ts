


export const globel_errors = async (
    error: any,
    req: Request,
    res: any,
    next: Function
  ) => {
    console.log(error);
  
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error.name == "castError") {
      return res.status(400).json({ message: "invalid id format" });
    }
    if (error.name == "TokenExpirdError") {
      return res.status(400).json({
        message: "unauthorized: your token has expired plss Login again",
      });
    }
    if (error.name == "jsonWebTokenError") {
      return res.status(400).json({ mesage: "token expird" });
    }
    console.log(error.message);
  
    return res.status(500).json({ message: error });
  };