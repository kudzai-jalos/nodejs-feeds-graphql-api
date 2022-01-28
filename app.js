const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = {
        status: "Done",
      };

      resolve(data);
    }, 1500);
  });

  return promise;
};

setTimeout(() => {
  console.log("Hello");
  fetchData().then(data=>{
    console.log(data)
    return fetchData();
  }).then(data=>{
    console.log(data.status)
  })
}, 1000);

console.log("Hi");
