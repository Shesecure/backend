exports.permit = (...permittedRoles) => {
  // return a middleware
  return (request, response, next) => {
    const { user } = request;
    console.log(permittedRoles);
    if (user && permittedRoles.includes(user.role)) {
      console.log(user.role);
      next(); // role is allowed, so continue on the next middleware
    } else {
      response.status(403).json({ message: "Forbidden" }); // user is forbidden
    }
  };
};
