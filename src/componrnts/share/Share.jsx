import "./share.css";
import { PermMedia } from "@mui/icons-material";
import { InputBase, Menu } from "@mui/material";
import React, { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';
import { useNavigate } from "react-router-dom";
import { alert } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Picker from 'emoji-picker-react';


export default function Share(props) {
  const history = useNavigate();
  var profile = localStorage.getItem('profile');

  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(image);
    }
    else {
      setPreview(null);
    }
  }, [image])

  const handlechange = (e) => {
    setCaption(e.target.value);

  }

  const browse = (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded) {
      setImage(fileUploaded);
    }
    else {
      setImage(null);
    }
  }

  const createpost = () => {
    const bdy = new FormData()
    bdy.append('url', image);
    bdy.append('caption', caption);


    fetch('https://winbookbackend.d3m0n1k.engineer/post/', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": "Token " + localStorage.getItem('authtoken')
      },
      body: bdy,

    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        alert({ message: 'Post created successfully', type: 'success' });
        history('/home')
      }
      else {
        alert({ message: 'Something went wrong! Please try again', type: 'error' });
      }
    })
  }

  const onEmojiClick = (emojiObject) => {
    document.getElementById("captionprofile").value += emojiObject.emoji;
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open1 = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    profile = localStorage.getItem('profile');
  }, [props.reload])

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          {/* <Avatar className="shareProfileImg" /> */}
          <img src={profile} alt="profile pic" className="shareProfileImg" />
          <InputBase
            placeholder="What's on your mind ?"
            className="shareInput"
            id="captionprofile"
            onChange={handlechange}
          />
        </div>
        <hr className="shareHr" />
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <label htmlFor="formId">
                <input name="file" accept='image/*' type="file" id="formId" hidden onChange={browse} />
                <PermMedia htmlColor="tomato" className="shareIcon" sx={{ marginRight: 2, cursor: 'pointer' }} />
              </label>
              <EmojiEmotionsIcon className="shareIcon" color="error" onClick={
                handleClick
              } />
              {preview ? <Badge badgeContent={'x'} color="error" onClick={() => {
                setImage(null);
                setPreview(null);
              }}>
                <img src={preview} alt='new post' height={50} width={70} /> </Badge> : <Paper elevation={12} />}
            </div>
          </div>
          <button className="shareButton" onClick={createpost}>Share</button>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open1}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Picker onEmojiClick={onEmojiClick} pickerStyle={{ width: "100%" }} />
      </Menu>
    </div>
  );
}