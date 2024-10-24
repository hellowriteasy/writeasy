"use client";
import React, { useState, SyntheticEvent, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Bee from "@/public/Game/cloud3.svg";
import Image from "next/image";
import Subscription from "@/app/components/Subscription";
import useAuthStore from "@/app/store/useAuthStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/app/utils/config/axios";
import { TPrompt, TStory, TUser } from "@/app/utils/types";
import Logo from "@/public/Landingpage-img/logo.svg";
import { useRouter } from "next/navigation";
import { convertToHtml, divideNewlinesByTwo } from "@/app/utils/methods";
import HardBreak from "@tiptap/extension-hard-break";
import EditorWordCount from "@/app/components/tiptap/EditorWordCount";
import CharacterCount from "@tiptap/extension-character-count";
interface Props {
  searchResults: TUser[];
  handleSelectedUser: (selectedUser: TUser) => void;
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
  const [Value, setValue] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<
    { name: string; email: string }[]
  >([]); // Updated state to store both name and email
  const [inviting, setInviting] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TUser[]>([]); // State to hold search results
  const [prompt, setPrompt] = useState<TPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStory, setCurrentStory] = useState<TStory | null>(null);
  const [submittingStory, setSubmittingStory] = useState(false);
  const [isPublicStory, setIsPublicStory] = useState(true);
  const isSubcriptionActive = useAuthStore(
    (state) => state.isSubcriptionActive
  );
  const { userId, token, role, status } = useAuthStore();
  const params = useParams();
  const promptId = params._id;
  const router = useRouter();
  const AxiosIns = axiosInstance(token || "");
  let limit = 1000000;
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
      HardBreak,
      CharacterCount.configure({
        limit,
      }),
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
    },
  }) as Editor;
  const fetchUsers = async () => {
    try {
      // if (!searchQuery.trim()) {
      //   setSearchResults([]);
      //   return;
      // }
      setShowCard(true);
      const { data } = await AxiosIns.get(
        `/auth/users/search?search_query=${searchQuery}&exclude_unpaid_user=true`
      );
      const filtered = data.filter((user: any) => user._id !== userId);
      setSearchResults(filtered);
    } catch (error) {
      setShowCard(false);
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again later.");
    }
  };

  const handleSearchChange = async (e: any): Promise<void> => {
    setSearchQuery(e.target.value);
    await fetchUsers();
  };

  // Update to handle both email and name
  const handleSelectedUser = (selectedUser: TUser): void => {
    if (
      selectedUsers.length < 5 &&
      !selectedUsers.find((user) => user.email === selectedUser.email)
    ) {
      setSelectedUsers([
        ...selectedUsers,
        { name: selectedUser.username, email: selectedUser.email },
      ]);
    }
  };
  const handleRemoveUser = (email: string, e: SyntheticEvent): void => {
    e.preventDefault(); // Prevents page refresh
    setSelectedUsers(selectedUsers.filter((user) => user.email !== email));
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
    if (currentStory && editor) {
      editor?.commands?.clearContent();
      editor.commands.insertContent(convertToHtml(currentStory.content || ""));
      handleStoryDetailsInputChange("title", currentStory.title);
      handleStoryDetailsInputChange("content", currentStory.content);
    }
  }, [currentStory, editor]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const storyId = currentStory?._id;
    try {
      const currentContent = divideNewlinesByTwo(editor.getText() || "");

      // early return
      if (!storyId) return;

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

    if (!selectedUsers || selectedUsers.length === 0) {
      toast.error("Please select at least one user.");
      return;
    }

    setInviting(true);
    try {
      const invitePayload = {
        storyID: storyId,
        email: selectedUsers.map((user) => user.email),
        promptID: promptId,
        userID: userId,
        isPublic: isPublicStory,
      };

      if (invitePayload) {
        const { data } = await AxiosIns.post(
          `/collaborative-stories/invite`,
          invitePayload
        );
      }

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
  const RenderUserCard: React.FC<Props> = ({
    searchResults,
    handleSelectedUser,
  }) => (
    <div className="p-4 h-96 overflow-y-auto  bg-white shadow-lg rounded-lg">
      {searchResults.map((result, index) => (
        <div
          key={index}
          className="p-4 border-b border-gray-200 cursor-pointer flex items-center hover:bg-gray-100 transition-colors duration-200 ease-in-out"
          onClick={(e) => handleSelectedUser(result)}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            {result.profile_picture &&
            result.profile_picture.startsWith("https") ? (
              <img
                className="w-full h-full"
                src={result.profile_picture}
                alt="profile picture"
              />
            ) : (
              <Image src={Logo} alt="Image" width={50} height={50} />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {result.username}
            </div>
            {/* <div className="text-sm text-gray-500">{result.email}</div> */}
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
          <span>{user.name}</span>
          <button
            className="remove-user bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center focus:outline-none"
            onClick={(e) => handleRemoveUser(user.email, e)}
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
      {/* <label className="block mb-2 font-medium">Invite Collaborators</label> */}
      {selectedUsers.length > 0 && showCard && (
        <div className="mt-2">{renderSelectedUsers()}</div>
      )}
      <div className="flex gap-x-2">
        <input
          type="email"
          className="w-full p-2 border outline-yellow-100 border-gray-300 rounded"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search users by email"
        />
        <button
          className="px-4  bg-black text-white rounded"
          onClick={handleInvite}
          disabled={inviting}
        >
          {inviting ? "Inviting..." : "Invite"}
        </button>
      </div>
      <div className="flex gap-x-2 mt-2">
        <input
          type="checkbox"
          name="isPrivate"
          checked={!isPublicStory}
          onChange={(e) => {
            console.log(e.target.checked);
            setIsPublicStory(!e.target.checked);
          }}
        />
        Would your group prefer to write without others seeing it?
      </div>

      {showCard && searchQuery && (
        <RenderUserCard
          searchResults={searchResults}
          handleSelectedUser={handleSelectedUser}
        />
      )}
    </div>
  );

  return (
    <div className="w-full h-[1000px] mt-6 z-0 relative flex justify-center ">
      <div className="w-10/12 h-screen  flex flex-col gap-y-4">
        <div className="w-full  relative pt-4 flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              {/* <h1 className="text-6xl sm:text-2xl pt-4 py-2 font-bold font-unkempt">
                {prompt?.title || ""}
              </h1>
              <p className="font-unkempt sm:text-sm text-xl">
                {prompt?.description}
              </p> */}
            </div>
            {!currentStory && (
              <div className="flex flex-col sm:gap-y-0 gap-y-6">
                <h1 className="font-unkempt text-2xl  font-bold">
                  Invite friends to join Collaborative Writing
                </h1>
                {/*
                <p className="text-xl font-unkempt">
                  Calling all friends! , Let team up and create stories
                  together.
                </p>

                <p className="text-xl font-unkempt">
                  Let the storytelling begin!
                </p> */}
              </div>
            )}
          </div>
          {currentStory ? (
            <div className="w-full pt-2 flex flex-col gap-y-2">
              <h2 className="font-unkempt">Writers</h2>
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
          <div className="absolute sm:hidden -top-40 mt-3 -left-48">
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
                        className={`border border-gray-500 z-10 text-xl rounded-full indent-7 sm:w-full w-[50vw] h-12 focus:outline-none focus:border-yellow-600 ${
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
                    <div className=" bg-black rounded-3xl w-full ">
                      <div className="editor bg-white p-4 rounded-3xl relative shadow-md w-full">
                        <div className="menu flex gap-5 w-[100%] h-12 left-0 top-0 flex-col border border-slate-300 bg-slate-100 rounded-t-3xl absolute">
                          <div className="flex gap-3 p-3 ps-6 w-full">
                            {submittingStory && (
                              <div className="loader mr-10 "></div>
                            )}
                          </div>
                        </div>
                        <div className={` rounded-3xl font-comic  `}>
                          <EditorContent
                            className={`scroll-m-2 w-full min-h-96 mt-10  ${
                              !currentStory || submittingStory
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            editor={editor}
                          />
                        </div>
                      </div>
                    </div>
                    <EditorWordCount
                      characters={editor.storage.characterCount.characters()}
                      limit={limit}
                      words={editor.storage.characterCount.words()}
                    />
                    <button
                      onClick={handleSubmit}
                      className="text-white bg-black border text-2xl font-bold font-unkempt rounded-full  px-3 h-[60px]"
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
      {status === "suspended" ? (
        <Subscription isAccountSuspended={true} />
      ) : !isSubcriptionActive && role !== "admin" ? (
        <Subscription />
      ) : null}
    </div>
  );
};

export default Page;
