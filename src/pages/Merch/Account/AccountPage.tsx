import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MerchHeader } from '../components/MerchHeader';
import { useAuth } from '../../../auth/AuthContext';
import { updateCurrentUser } from '../../../api/authApi';
import { updateProfileImage, removeProfileImage } from '../../../api/authApi';
import { useHeaderOcclusion } from '../hooks/useHeaderOcclusion';
import { AdminSection } from '../components/AccountComponents/AdminSection';

import './AccountPage.css';

export function AccountPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const divRef = useHeaderOcclusion<HTMLDivElement>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImageError, setProfileImageError] = useState('');

  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropImageElement, setCropImageElement] = useState<HTMLImageElement | null>(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropScale, setCropScale] = useState(1);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0, });
  const cropAreaRef = useRef<HTMLDivElement>(null);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setProfileImageError(
        'Only JPEG, PNG, and WebP images are allowed.',
      );

      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setProfileImageError(
        'Profile images must be 5MB or smaller.',
      );

      event.target.value = '';
      return;
    }

    setProfileImageError('');

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      setCropImage(imageUrl);
      setCropImageElement(image);

      setCropX(0);
      setCropY(0);
      setCropScale(1);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);

      setProfileImageError('Unable to load that image.');
    };

    image.src = imageUrl;

    event.target.value = '';
  };

  const getCropBounds = (scale: number) => {
    if (!cropImageElement) {
      return {
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
      };
    }

    const cropCircleSize = 220;
    const cropRadius = cropCircleSize / 2;

    const baseScale = Math.max(
      cropCircleSize / cropImageElement.naturalWidth,
      cropCircleSize / cropImageElement.naturalHeight,
    );

    const displayWidth =
      cropImageElement.naturalWidth * baseScale * scale;

    const displayHeight =
      cropImageElement.naturalHeight * baseScale * scale;

    const maxX = Math.max(
      0,
      displayWidth / 2 - cropRadius,
    );

    const maxY = Math.max(
      0,
      displayHeight / 2 - cropRadius,
    );

    return {
      minX: -maxX,
      maxX,
      minY: -maxY,
      maxY,
    };
  };

  const handleCropPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (isUploadingImage) return;

    setIsDraggingCrop(true);

    setCropDragStart({
      x: event.clientX - cropX,
      y: event.clientY - cropY,
    });

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleRemoveProfileImage = async () => {
    setIsUploadingImage(true);

    try {
      const updatedUser =
        await removeProfileImage();

      updateUser(updatedUser);
    } catch (error) {
      console.error(
        'Failed to remove profile image:',
        error,
      );

      setProfileImageError(
        'Failed to remove profile image. Please try again.',
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    setUsername(user?.username ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
  }, [user]);

  function getNextUpdateDate(updatedAt: string | null,) {
    if (!updatedAt) {
      return null;
    }

    const updatedDate = new Date(updatedAt);
    const nextUpdateDate = new Date(updatedDate.getTime() + 30 * 24 * 60 * 60 * 1000,);

    if (nextUpdateDate <= new Date()) {
      return null;
    }

    return nextUpdateDate;
  }

  function formatCooldown(updatedAt: string | null,) {
    const nextUpdateDate = getNextUpdateDate(updatedAt);

    if (!nextUpdateDate) {
      return 'Can be changed anytime.';
    }

    return `Can be changed again on ${nextUpdateDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    )}.`;
  }

  function isOnCooldown(updatedAt: string | null) {
    return getNextUpdateDate(updatedAt) !== null;
  }

  const usernameOnCooldown = isOnCooldown(user?.usernameUpdatedAt ?? null,);
  const emailOnCooldown = isOnCooldown(user?.emailUpdatedAt ?? null,);
  const passwordOnCooldown = isOnCooldown(user?.passwordUpdatedAt ?? null,);

  function handleLogout() {
    logout();
    navigate('/store');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>,) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    const hasUsernameChanged =
      username !== user?.username;

    const hasEmailChanged =
      email !== user?.email;

    const hasPasswordChanged =
      password.length > 0;

    if (
      !hasUsernameChanged &&
      !hasEmailChanged &&
      !hasPasswordChanged
    ) {
      setErrorMessage(
        'No changes were made.',
      );
      setIsLoading(false);
      return;
    }

    try {
      const updatedUser = await updateCurrentUser({
        ...(username !== user?.username
          ? { username }
          : {}),
        ...(email !== user?.email
          ? { email }
          : {}),
        ...(password
          ? { password }
          : {}),
      });

      updateUser(updatedUser);

      setPassword('');
      setSuccessMessage('Account updated successfully',);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setErrorMessage(
            'Unable to connect to the server.',
          );
        } else if (
          error.response.status === 409
        ) {
          setErrorMessage(
            error.response.data?.message ??
            'That username or email is already in use.',
          );
        } else {
          setErrorMessage(
            error.response.data?.message ??
            'Unable to update your account.',
          );
        }
      } else {
        setErrorMessage(
          'Something went wrong. Please try again.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleCropPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDraggingCrop) return;

    const bounds = getCropBounds(cropScale);

    const nextX = event.clientX - cropDragStart.x;
    const nextY = event.clientY - cropDragStart.y;

    setCropX(
      Math.min(
        bounds.maxX,
        Math.max(bounds.minX, nextX),
      ),
    );

    setCropY(
      Math.min(
        bounds.maxY,
        Math.max(bounds.minY, nextY),
      ),
    );
  };

  const handleCropPointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    setIsDraggingCrop(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleCropZoomChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextScale = Number(event.target.value);

    const bounds = getCropBounds(nextScale);

    setCropScale(nextScale);

    setCropX((currentX) =>
      Math.min(
        bounds.maxX,
        Math.max(bounds.minX, currentX),
      ),
    );

    setCropY((currentY) =>
      Math.min(
        bounds.maxY,
        Math.max(bounds.minY, currentY),
      ),
    );
  };

  const createCroppedImage = async (): Promise<File | null> => {
    if (!cropImageElement) {
      return null;
    }

    const cropCircleSize = 220;
    const outputSize = 512;

    const image = cropImageElement;

    const baseScale = Math.max(
      cropCircleSize / image.naturalWidth,
      cropCircleSize / image.naturalHeight,
    );

    const finalScale = baseScale * cropScale;

    const displayedWidth =
      image.naturalWidth * finalScale;

    const displayedHeight =
      image.naturalHeight * finalScale;

    /*
     * cropX / cropY represent the image's movement
     * relative to the centre of the crop circle.
     */
    const imageX =
      (cropCircleSize - displayedWidth) / 2 + cropX;

    const imageY =
      (cropCircleSize - displayedHeight) / 2 + cropY;

    const canvas = document.createElement('canvas');

    canvas.width = outputSize;
    canvas.height = outputSize;

    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    const scaleFactor =
      outputSize / cropCircleSize;

    context.clearRect(
      0,
      0,
      outputSize,
      outputSize,
    );

    context.save();

    /*
     * Make the final file circular as well.
     */
    context.beginPath();

    context.arc(
      outputSize / 2,
      outputSize / 2,
      outputSize / 2,
      0,
      Math.PI * 2,
    );

    context.clip();

    context.drawImage(
      image,
      imageX * scaleFactor,
      imageY * scaleFactor,
      displayedWidth * scaleFactor,
      displayedHeight * scaleFactor,
    );

    context.restore();

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          resolve(
            new File(
              [blob],
              'profile-image.png',
              {
                type: 'image/png',
                lastModified: Date.now(),
              },
            ),
          );
        },
        'image/png',
      );
    });
  };

  const handleSaveCroppedImage = async () => {
    if (!cropImageElement) return;

    setProfileImageError('');
    setIsUploadingImage(true);

    try {
      const croppedFile = await createCroppedImage();

      if (!croppedFile) {
        throw new Error('Failed to create cropped image.');
      }

      const updatedUser =
        await updateProfileImage(croppedFile);

      updateUser(updatedUser);

      if (cropImage) {
        URL.revokeObjectURL(cropImage);
      }

      setCropImage(null);
      setCropImageElement(null);

      setCropX(0);
      setCropY(0);
      setCropScale(1);
    } catch (error) {
      console.error(
        'Failed to update profile image:',
        error,
      );

      setProfileImageError(
        'Failed to update profile image. Please try again.',
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCancelCrop = () => {
    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }

    setCropImage(null);
    setCropImageElement(null);

    setCropX(0);
    setCropY(0);
    setCropScale(1);
  };

  const bgImageUrl = {
    backgroundImage: `url("${import.meta.env.BASE_URL}Images/MerchPage/FeaturedPage/xox-background.png")`
  };

  return (
    <>
      <title>Xoxxly Merch Store | Account</title>

      <div className="background-container" style={bgImageUrl}>

        <MerchHeader />

        <div className="account-page-container" ref={divRef}>
          <h1 className="account-page-title">Account Page</h1>

          <div className="account-info-container">
            <p className="account-info-title">Account</p>

            <div className="account-info-details-container">

              <form className="account-info-form" onSubmit={handleSubmit}>

                <div className="account-info-field">
                  <label className="account-info-text">
                    <span>Username:</span>
                    <div className="username-info-input">
                      <input className="account-info-input" type="text" value={username} onChange={(event) => setUsername(event.target.value)} minLength={3} maxLength={15} disabled={usernameOnCooldown} required />

                      <div className="user-req-container">
                        <p className="account-info-req-title">
                          <span>Username Requirements</span>
                        </p>
                        <p className="account-info-req-text">&bull; Min 3 Characters <br /> &bull; Max 15 Characters <br /> &bull; No Spaces <br /> &bull; Must be unique</p>
                      </div>
                    </div>
                  </label>

                  <p className={usernameOnCooldown ? 'account-info-cooldown account-info-cooldown-locked' : 'account-info-cooldown'}>
                    {formatCooldown(user?.usernameUpdatedAt ?? null)}
                  </p>
                </div>

                <div className="account-info-field">
                  <label className="account-info-text">
                    <span>Email:</span>
                    <input className="account-info-input" type="text" value={email} onChange={(event) => setEmail(event.target.value)} disabled={emailOnCooldown} required />
                  </label>

                  <p className={emailOnCooldown ? 'account-info-cooldown account-info-cooldown-locked' : 'account-info-cooldown'}>
                    {formatCooldown(user?.emailUpdatedAt ?? null)}
                  </p>
                </div>

                <div className="account-info-field">
                  <label className="account-info-text">
                    <span>Password:</span>

                    <div className="password-input-container">
                      <input className="account-info-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={18} disabled={passwordOnCooldown} />

                      <div className="password-req-container">
                        <p className="account-info-req-title">
                          <span>Password Requirements</span>
                        </p>
                        <p className="account-info-req-text">&bull; Min 3 Characters <br /> &bull; Max 18 Characters <br /> &bull; No Spaces <br /> &bull; At least one number <br /> &bull; At lease one special character</p>
                      </div>
                    </div>
                  </label>

                  <p className={passwordOnCooldown ? 'account-info-cooldown account-info-cooldown-locked' : 'account-info-cooldown'}>
                    {formatCooldown(user?.passwordUpdatedAt ?? null)}
                  </p>
                </div>


                {errorMessage && (
                  <p className="auth-error">
                    {errorMessage}
                  </p>
                )}

                {successMessage && (
                  <p className="account-success">
                    {successMessage}
                  </p>
                )}

                <button type="submit" disabled={isLoading} className="save-changes-button">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>

              <form className="account-info-form-img" onSubmit={handleSubmit}>
                <img
                  src={
                    user?.image ??
                    `${import.meta.env.BASE_URL}Images/MerchHeader/MH-Account.png`
                  }
                  alt="Profile"
                  className="account-profile-image-preview"
                />

                <div className="img-button-container">
                  <button
                    type="button"
                    onClick={handleProfileImageClick}
                    disabled={isUploadingImage}
                    className="change-profile-pic-button"
                  >
                    {isUploadingImage
                      ? 'Uploading...'
                      : 'Change profile image'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveProfileImage}
                    disabled={
                      isUploadingImage || !user?.image
                    }
                    className="remove-profile-pic-button"
                  >
                    Remove profile image
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfileImageChange}
                    hidden
                  />
                </div>

                {profileImageError && (
                  <p className="account-profile-image-error">
                    {profileImageError}
                  </p>
                )}
              </form>

            </div>

            <button className="logout-button" type="button" onClick={handleLogout}>Logout</button>
          </div>

          {user?.role === 'ADMIN' && (
            <AdminSection />
          )}
        </div>

        {cropImage && cropImageElement && (
          <div className="profile-crop-modal-overlay">
            <div className="profile-crop-modal">
              <h2>Choose your profile image</h2>

              <p>
                Drag the image to position it inside the circle.
              </p>

              <div
                ref={cropAreaRef}
                className="profile-crop-area"
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerUp}
                onPointerCancel={handleCropPointerUp}
              >
                <img
                  src={cropImage}
                  alt="Profile crop preview"
                  className="profile-crop-image"
                  draggable={false}
                  style={{
                    width: `${cropImageElement.naturalWidth}px`,
                    height: `${cropImageElement.naturalHeight}px`,
                    left: '50%',
                    top: '50%',
                    transform: `
                      translate(
                        calc(-50% + ${cropX}px),
                        calc(-50% + ${cropY}px)
                      )
                      scale(${(() => {
                        const baseScale = Math.max(
                          220 / cropImageElement.naturalWidth,
                          220 / cropImageElement.naturalHeight,
                        );

                        return baseScale * cropScale;
                      })()})
                    `,
                  }}
                />

                <div className="profile-crop-circle" />
              </div>

              <div className="profile-crop-zoom">
                <label>
                  Zoom

                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.01"
                    value={cropScale}
                    onChange={handleCropZoomChange}
                  />
                </label>
              </div>

              <div className="profile-crop-buttons">
                <button
                  type="button"
                  onClick={handleCancelCrop}
                  disabled={isUploadingImage}
                  className="crop-button"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveCroppedImage}
                  disabled={isUploadingImage}
                  className="crop-button"
                >
                  {isUploadingImage
                    ? 'Saving...'
                    : 'Save Image'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}