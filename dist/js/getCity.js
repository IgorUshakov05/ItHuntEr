
const input = document.getElementById('address')
input.addEventListener('input',  () => {
    if (input.value) {
        const town = input.value
        const countrt = town.split(',')

        let data = {
            country: countrt[0] || null,
            oblast: countrt[1] || null,
            city: countrt[2] || null,
        }
        data = JSON.stringify(data)
    const timeoutId = setTimeout(() => {
        fetch(`/getCity/${data}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Success:", data);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }, 800);

    // clearTimeout clears the timeout
    input.addEventListener('input', () => clearTimeout(timeoutId));
} return false
})
