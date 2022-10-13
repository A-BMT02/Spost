import React from 'react' ; 

export default interface ContextProps {
    twitterMax? : any;
    setTwitterMax?: React.Dispatch<React.SetStateAction<any[]>>;
    twitterPreviewCounter?: number;
    setTwitterPreviewCounter?: React.Dispatch<React.SetStateAction<number>>;
    state?: any
    dispatch?: any ;
    twitterCounter?: number;
    setTwitterCounter?: React.Dispatch<React.SetStateAction<number>>;
    select?: any
    setSelect?: React.Dispatch<React.SetStateAction<any[]>>;
    preview?: boolean;
    setPreview?: React.Dispatch<React.SetStateAction<boolean>>;
    image?: string ;
    setImage?:  React.Dispatch<React.SetStateAction<string>>
    target?: string ;
    setTarget?: React.Dispatch<React.SetStateAction<string>>;
    previewTarget?: string ;
    setPreviewTarget?:React.Dispatch<React.SetStateAction<string>>;
    twitterContent?: any;
    setTwitterContent?:React.Dispatch<React.SetStateAction<any[]>>;
    facebookContent?: string;
    setFacebookContent?:React.Dispatch<React.SetStateAction<string>>
    linkedinContent?: string ;
    setLinkedinContent?: React.Dispatch<React.SetStateAction<string>>
    twitterPicture?: any ;
    setTwitterPicture?: React.Dispatch<React.SetStateAction<any[]>>;
    facebookPicture?: any
    setFacebookPicture?: React.Dispatch<React.SetStateAction<any[]>>;
    linkedinPicture?: any;
    setLinkedinPicture?: React.Dispatch<React.SetStateAction<any[]>>;
    socials?: any ;
    setSocials?: React.Dispatch<React.SetStateAction<any[]>>;
    instagramContent?:any ;
    setInstagramContent?:React.Dispatch<React.SetStateAction<string>>;
}