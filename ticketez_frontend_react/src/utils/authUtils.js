const getRolesFromLocalStorage = () => {
  const roles = localStorage.getItem('roles');
  return roles ? JSON.parse(roles) : [];
};


const hasSuperAdminRole = () => {
  const roles = getRolesFromLocalStorage();
  return (
    roles.includes('SUPER_ADMIN') ||
    roles.includes('MOVIE_MANAGEMENT_ADMIN') ||
    roles.includes('SCHEDULING_PRICING_ADMIN') ||
    roles.includes('CINEMA_MANAGEMENT_ADMIN') ||
    roles.includes('SERVICE_EVENT_MANAGEMENT_ADMIN') ||
    roles.includes('USER_MANAGEMENT_ADMIN')
  );
};


export { getRolesFromLocalStorage, hasSuperAdminRole };
