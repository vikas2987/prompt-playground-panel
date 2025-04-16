
/**
 * Gets the appropriate API domain based on the current URL
 */
export const getApiDomain = () => {
  const isProd = window.location.hostname === 'cstpanel.paytm.com';
  return isProd 
    ? 'https://cst-gateway.paytm.com' 
    : 'https://cststaging-gateway.paytm.com';
};
