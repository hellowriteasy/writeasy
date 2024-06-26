"use client";
import React, { useCallback, useState, SyntheticEvent, useEffect } from "react";
import classNames from "classnames";
import { useEditor, EditorContent,Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import * as Icons from "../../../components/Icons";
import Bee from "@/public/Game/cloud3.svg";
import Image from "next/image";
import Subscription from "@/app/components/Subscription";
import useAuthStore from "@/app/store/useAuthStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import { TPrompt, TStory } from "@/app/utils/types";
import Logo from "@/public/Landingpage-img/logo.svg";
import { useRouter } from "next/navigation";
interface SearchResult {
  username: string;
  email: string; 
}
interface Props {
  searchResults: SearchResult[];
  handleSelectedUser: (selectedEmail: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

interface Props {
  searchResults: SearchResult[];
  handleSelectedUser: (selectedEmail: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
const Page = () => {
  const [storyDetails, setStoryDetails] = useState({
    title: "",
    email: "",
    content: "",
    wordCount: 0,
    wordLimitExceeded: false,
    refresh: false,
  });
  const [Value,setValue]=useState<string>("")
  const [selectedUsers, setSelectedUsers]= useState <string[]> ([]);
  const [inviting, setInviting] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // State to hold search results
  const [prompt, setPrompt] = useState<TPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStory, setCurrentStory] = useState<TStory | null>(null);
  const [submittingStory, setSubmittingStory] = useState(false);
  const isSubcriptionActive = useAuthStore(
    (state) => state.isSubcriptionActive
  );
  const { userId, token, role } = useAuthStore();
  const params = useParams();
  const promptId = params._id;
  const router = useRouter();
  const AxiosIns = axiosInstance(token || "");

  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base w-full inline-block lg:prose-lg xl:prose-2xl outline-none min-h-96",
      },
    },
    content: storyDetails.content,
    onUpdate: ({ editor }) => {
      const textContent = editor.getText();
      const words = textContent.split(/\s+/).filter(Boolean).length;
      handleStoryDetailsInputChange("wordCount", words);
      handleStoryDetailsInputChange("wordLimitExceeded", words > 1000);
    },
  }) as Editor;
  const fetchUsers = async () => {
    try {
      // if (!searchQuery.trim()) {
      //   setSearchResults([]); 
      //   return;
      // }
      setShowCard(true)
      const { data } = await AxiosIns.get(
        `/auth/users/search?search_query=${searchQuery}`
      );
      setSearchResults(data); 
      console.log(data)
    
    } catch (error) {
      setShowCard(false)
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again later.");
    }
  };
  
  const handleSearchChange = async (e:any): Promise<void> => {
    setSearchQuery(e.target.value); 
    await fetchUsers(); 
  };
  
  const handleSelectedUser = (selectedEmail: string): void => {
    setValue(selectedEmail); 
    if (selectedUsers.length < 5 && !selectedUsers.includes(selectedEmail)) {
      setSelectedUsers([...selectedUsers, selectedEmail]);
    }
  };
  
  const handleRemoveUser = (email: string, e:SyntheticEvent): void => {
    e.preventDefault(); // Prevents page refresh
    setSelectedUsers(selectedUsers.filter((user) => user !== email));
  };


  const fetchPromptById = async () => {
    try {
      const { data } = await AxiosIns.get(`/prompts/${promptId}`);
      setPrompt(data);
    } catch (error) {
      //
    }
  };

  const fetchStoryOfUserByPromptId = async () => {
    try {
      const { data } = await AxiosIns.get(
        `/stories/user/${promptId}/${userId}`
      );
      if (data) {
        setCurrentStory(data);
      }
    } catch (error) {
      //
    }
  };
  
  useEffect(() => {
    fetchStoryOfUserByPromptId();
  }, [userId, promptId, storyDetails.refresh]);

  useEffect(() => {
    if (promptId) {
      fetchPromptById();
    }
  }, [promptId]);
  
  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue =
        "Refreshing the P may erase your changes. Are you sure you want to continue?";
      return "Refreshing the page may erase your changes. Are you sure you want to continue?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  useEffect(() => {
    console.log("inside", currentStory);
    if (currentStory && editor) {
      editor?.commands?.clearContent();
      editor.commands.insertContent(currentStory.content);
      handleStoryDetailsInputChange("title", currentStory.title);
      handleStoryDetailsInputChange("content", currentStory.content);
    }
  }, [currentStory, editor]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const storyId = currentStory?._id;
    try {
      const currentContent = editor.getText();
      // early return
      if (!storyId) return;
      if (!storyDetails.title || !currentContent) {
        toast.error("Please enter both title and content before submitting.");
        return;
      }
      if (storyDetails.wordLimitExceeded) {
        toast.error("Word limit exceeded. Please reduce the number of words.");
        return;
      }

      setSubmittingStory(true);
      if (currentStory?._id) {
        const payload = {
          storyID: storyId,
          text: currentContent,
          title: storyDetails.title,
        };
        await AxiosIns.post(`/collaborative-stories/submit`, payload);
      } else {
        const payload = {
          user: userId,
          title: storyDetails.title,
          content: currentContent,
          storyType: "game",
          prompt: promptId,
        };

        setIsLoading(true);
        await AxiosIns.post(`/stories`, payload);
        setStoryDetails((prev) => ({
          ...prev,
          refresh: !prev.refresh,
        }));
      }
      
      router.push(`/profile/game?prompt_id=${promptId}`);

      setSubmittingStory(false);
      toast.success("Story saved successfully");
      return toast;
    } catch (error) {
      setSubmittingStory(false);
      toast.error(
        "An error occurred while submitting the story. Please try again later."
      );
    }
  };

  const handleInvite = async (e: SyntheticEvent) => {
    e.preventDefault();

    const storyId = currentStory?._id;
    // const emailList = selectedUsers.join('","');
    // // if (!email) {
    //   toast.error("Please enter an email address.");
    //   return;
    // }
    setInviting(true);
    try {
      const invitePayload = {
        storyID: storyId,
        email:selectedUsers, 
        promptID: promptId,
        userID: userId
      };

      const { data } = await AxiosIns.post(
        `/collaborative-stories/invite`,
        invitePayload
      );
      setInviting(false);
      router.push("/profile/game");
      handleStoryDetailsInputChange("refresh", !storyDetails.refresh);
    } catch (error: any) {
      console.log(error);
      setInviting(false);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while sending the invitation. Please try again later."
      );
    }
  };

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleStoryDetailsInputChange = (
    name: string,
    value: string | boolean | number
  ) => {
    setStoryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const RenderUserCard: React.FC<Props> = ({ searchResults, handleSelectedUser }) => (
    <div className="p-4 h-96 overflow-y-auto bg-white shadow-lg rounded-lg">
      {searchResults.map((result, index) => (
        <div
          key={index}
          className="p-4 border-b border-gray-200 cursor-pointer flex items-center hover:bg-gray-100 transition-colors duration-200 ease-in-out"
          onClick={(e) => handleSelectedUser(result.email, e)} // Add user selection handler
        >
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-custom-yellow text-white flex items-center justify-center">
            {result.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{result.username}</div>
            <div className="text-sm text-gray-500">{result.email}</div>
          </div>
        </div>
      ))}
      {searchResults.length === 0 && (
        <div className="p-4 text-center text-gray-500">No users found.</div>
      )}
    </div>
  );
  const renderSelectedUsers = () => (
    <div className="selected-users flex flex-wrap gap-2 mt-2">
      {selectedUsers.map((user, index) => (
        <span
          key={index}
          className="selected-user flex items-center space-x-2 bg-custom-yellow text-black px-3 py-1 rounded-full shadow-sm"
        >
          <span>{user}</span>
          <button
            className="remove-user bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center focus:outline-none"
            onClick={(e) => handleRemoveUser(user, e)}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
  
  
  const contributors = currentStory
    ? Array.from(new Array(...currentStory?.contributors, currentStory?.user))
    : [];
  const InvitationButton = (
    
<div className="mb-4">
              <label className="block mb-2 font-medium">
                Invite Collaborators
              </label>
              {selectedUsers.length > 0 &&showCard&& (
                <div className="mt-2">{renderSelectedUsers()}</div>
              )}
              <div className="flex">
              <input
                type="email"
                className="w-full p-2 border outline-yellow-100 border-gray-300 rounded"
                value={searchQuery}
                onChange={handleSearchChange}
              />
               <button
                className="px-4  bg-black text-white rounded"
                onClick={handleInvite}
                disabled={inviting}
              >
                {inviting ? "Inviting..." : "Invite"}
              </button>
              </div>
              {showCard && searchQuery && (
                 <RenderUserCard searchResults={searchResults} handleSelectedUser={handleSelectedUser} />
                 
              )}
             
             
            </div>
   
  );

  return (
    <div className="w-full h-[1300px] mt-6 z-0 relative flex justify-center ">
      <div className="w-10/12 h-screen ms-12 flex flex-col gap-y-4">
        <div className="w-full  relative pt-4 flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-6xl pt-4 font-bold font-comic">
                {prompt?.title || ""}
              </h1>
              <p className="font-comic text-xl">{prompt?.description}</p>
            </div>
            {!currentStory && (
              <div className="flex flex-col gap-y-6">
                <h1 className="font-comic text-2xl font-bold">
                  Join the Collaborative Story Game!
                </h1>

                <p className="text-xl font-comic">
                  Calling all friends! , Let team up and create stories
                  together. To join, enter your email addresses separated by
                  commas:{" "}
                  <strong>
                    user1@gmail.com, user2@gmail.com, user3@gmail.com
                  </strong>
                </p>

                <p className="text-xl font-comic">
                  Let the storytelling begin!
                </p>
              </div>
            )}
          </div>
          {currentStory ? (
            <div className="w-full pt-2 flex flex-col gap-y-2">
              <h2 className="font-comic">Contributors</h2>
              <div className="flex gap-x-2">
                {contributors.map((contributor, index) => (
                  <div key={contributor._id}>
                    <div
                      className={`w-10 h-10 left-${
                        index * 3 + 3
                      } bg-white flex items-center justify-center rounded-full border overflow-hidden`}
                    >
                      {contributor.profile_picture &&
                      contributor.profile_picture.startsWith("https") ? (
                        <img
                          className="w-full h-full"
                          src={contributor.profile_picture}
                          alt=""
                        />
                      ) : (
                        <Image src={Logo} alt="contributor's profile picture" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex w-[100%] relative mt-0 ">
          <div className="absolute -top-40 mt-3 -left-48">
            <Image src={Bee} alt="bee" />
          </div>
          <div className="gap-8 relative  flex flex-col items-center  w-full">
            <form className="height-[800px] w-full">
              <div className="flex flex-col w-full  gap-4  ">
                {!currentStory && InvitationButton}
                {currentStory && (
                  <>
                    <div>
                      <input
                        className={`border border-gray-500 z-10 text-xl rounded-3xl indent-7 w-[50vw] h-12 focus:outline-none focus:border-yellow-600 ${
                          !currentStory || submittingStory
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="Untitled Story"
                        onChange={(e) => {
                          handleStoryDetailsInputChange(
                            "title",
                            e.target.value
                          );
                        }}
                        disabled={!currentStory}
                        value={storyDetails.title}
                      />
                    </div>
                    {/* should make it shared component in future  */}
                    <div className=" bg-black rounded-full w-full ">
                      <div className="editor bg-white p-4 rounded-3xl relative shadow-md w-full">
                        <div className="menu flex gap-5 w-[100%] h-12 left-0 top-0 flex-col border border-slate-300 bg-slate-100 rounded-t-3xl absolute">
                          <div className="flex gap-3 p-3 ps-6">
                            {submittingStory && (
                              <div className="loader mr-10 "></div>
                            )}

                            <button
                              className="menu-button mr-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                editor.chain().focus().undo().run();
                              }}
                              disabled={!editor.can().undo()}
                            >
                              <Icons.RotateLeft />
                            </button>
                            <button
                              className="menu-button mr-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                editor.chain().focus().redo().run();
                              }}
                              disabled={!editor.can().redo()}
                            >
                              <Icons.RotateRight />
                            </button>
                            <button
                              className={classNames("menu-button mr-2", {
                                "is-active": editor.isActive("bold"),
                              })}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleBold();
                              }}
                            >
                              <Icons.Bold />
                            </button>
                            <button
                              className={classNames("menu-button mr-2", {
                                "is-active": editor.isActive("underline"),
                              })}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleUnderline();
                              }}
                            >
                              <Icons.Underline />
                            </button>
                            <button
                              className={classNames("menu-button mr-2", {
                                "is-active": editor.isActive("italic"),
                              })}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleItalic();
                              }}
                            >
                              <Icons.Italic />
                            </button>
                            <button
                              className={classNames("menu-button mr-2", {
                                "is-active": editor.isActive("strike"),
                              })}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleStrike();
                              }}
                            >
                              <Icons.Strikethrough />
                            </button>
                            <button
                              className={classNames("menu-button mr-2", {
                                "is-active": editor.isActive("code"),
                              })}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleCode();
                              }}
                            >
                              <Icons.Code />
                            </button>
                            <div className="w-60 h-7 bg-white flex flex-col justify-center rounded-2xl shadow-sm ">
                              <p className="text-center font-comic">
                                Word count: {storyDetails.wordCount} / 1000
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={`w-[50vw] rounded-3xl  `}>
                          <EditorContent
                            className={`scroll-m-2 w-[100%] min-h-96 mt-10  ${
                              !currentStory || submittingStory
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            editor={editor}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="text-white bg-black border text-2xl font-bold font-comic rounded-full  px-3 h-[60px]"
                    >
                      {submittingStory ? "Submitting..." : "Submit"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      {!isSubcriptionActive && role != "admin" ? <Subscription /> : null}
    </div>
  );
};

export default Page;
