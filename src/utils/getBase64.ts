const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image()
            img.src = reader.result;
            img.onload = function () {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                const maxWidth = 600
                const maxHeight = 500
                let width = img.width
                let height = img.height
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight
                    }
                }
                canvas.width = width
                canvas.height = height
                ctx?.drawImage(img, 0, 0, width, height)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
                resolve(compressedBase64 as string)
            }
        };
        reader.onerror = (error) => reject(error);
    });
export default getBase64