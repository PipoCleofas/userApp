export const validateName = (fname: string | null, mname: string | null, lname: string | null) => {
    if (!fname || !mname || !lname) {
      return "First name, middle name, and last name are required.";
    }
    return null;
  };

  export const validatePassword = (password: string | null) => {
    if (!password) {
      return "Password cannot be empty.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }

    

    return null; // No error
  };

   // barangay and sitio

  

  
  export const validateBirthday = (birthday: string) => {
    if (!birthday) {
      return "Birthday cannot be empty.";
    }
    
    if(birthday.length != 10){
      return "Invalid birthday";
    }

    return null; // No error
  }

  export const handleBirthdayChange = (
    text: string,
    birthday: string | null,
    dispatch: React.Dispatch<any>
  ) => {
    let formattedText = text.replace(/[^0-9]/g, '');
    const previousBirthday = birthday || '';
  
    // Handle backspace or removal of characters
    if (formattedText.length < previousBirthday.replace(/[^0-9]/g, '').length) {
      dispatch({
        actionType: 'input',
        data: { birthdate: text }
      });
      return;
    }
  
    if (formattedText.length <= 2) {
      // Allow raw input (including leading 0) for month
      formattedText = formattedText;
    } else if (formattedText.length <= 4) {
      // Handle month and day input
      let month = formattedText.slice(0, 2);
      let day = formattedText.slice(2);
  
      let monthNum = parseInt(month, 10);
      if (monthNum === 0) month = '01';
      else if (monthNum > 12) month = '12';
  
      let dayNum = parseInt(day, 10);
      if (day && dayNum > 31) day = '31';
  
      formattedText = `${month}/${day}`;
    } else if (formattedText.length > 4) {
      // Handle full date input with year
      let month = formattedText.slice(0, 2);
      let day = formattedText.slice(2, 4);
      let year = formattedText.slice(4, 8);
  
      let monthNum = parseInt(month, 10);
      if (monthNum === 0) month = '01';
      else if (monthNum > 12) month = '12';
  
      let dayNum = parseInt(day, 10);
      if (dayNum > 31) day = '31';
  
      let currentYear = new Date().getFullYear();
      let yearNum = parseInt(year, 10);
      if (yearNum > currentYear) year = currentYear.toString();
  
      formattedText = `${month}/${day}/${year}`;
    }
  
    dispatch({
      actionType: 'input',
      data: { birthdate: formattedText }
    });
  };
  


  
  export const validateBarangayAndSitio = (barangay: string | null, sitio: string | null = null) => {
    if (!barangay) {
      return "Barangay must not be empty.";
    }
  
    if (!sitio) {
      return "Sitio must not be empty."; 
    }
  
    return null; 
  };

  export const validateUsernamePhoto = (username: string | null, photo?: any) => {
    if (!username || username.trim() === "") {
      return "Picture or username cannot be empty.";
    }
    
    
    if (!photo) {
      return "Photo cannot be empty or invalid.";
    }
    
   
    return null; // No error
  };
  

  export const validatePhotos = (photo1: string | null,photo2: string | null,photo3: string | null) => {

    if (!photo1 || photo1 === "" || typeof photo1 !== 'string' || !photo2 || photo2 === "" || typeof photo2 !== 'string' || !photo3 || photo3 === "" || typeof photo3 !== 'string') {
      return "Photo cannot be empty or invalid.";
    }
  
    return null; // No error
  };

  export const validateLogin = (username: string | null, password: string | null) => {
    if (!username || username.trim() === "") {
      return "Username cannot be empty.";
    }
  
    if (!password || password.trim() === "") {
      return "Password cannot be empty.";
    }
  
    return null; // No error
  };
  