// export const getProducts = () => {
//     const products = localStorage.getItem('products');
//     return products ? JSON.parse(products) : [];
//     };
    
//     export const saveProducts = (products) => {
//     localStorage.setItem('products', JSON.stringify(products));
//     };


    // export const getProducts = () => {
    //     const products = localStorage.getItem('products');
    //     return products ? JSON.parse(products) : [];
    //   };
      
    //   export const saveProducts = (products) => {
    //     localStorage.setItem('products', JSON.stringify(products));
    //   };
      

    export const getProducts = () => {
      const products = localStorage.getItem('products');
      return products ? JSON.parse(products) : [];
    };
    
    export const saveProducts = (products) => {
      localStorage.setItem('products', JSON.stringify(products));
    };
    