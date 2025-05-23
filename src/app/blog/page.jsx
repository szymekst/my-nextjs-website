//Import Next.js Stuff
import Link from "next/link";
import Image from "next/image";

//Import utils and components
import getPostMetadata from "@/utils/getPostMetadata";
import TitleSection from "@components/TitleSection";
import PaginationControls from "@components/PaginationControls";
import { createBlogPostSlug } from "@/utils/createBlogPostSlug";
import { metadata } from "@app/layout";

export async function generateMetadata() {
    return {
        title: `${"Blog" + " | " + metadata.title}`,
    };
}

export const createDateObject = (stringDate) => {
    //Create Array from date with format DD.MM.YYYY
    const dateToArray = stringDate.split(".");

    //Convert date to YYYY-MM-DD
    const dateObject = new Date(
        dateToArray[2],
        dateToArray[1] - 1,
        dateToArray[0]
    );

    return dateObject;
};

export const createDateString = (stringDate) => {
    const days = [
        "Niedziela",
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota",
    ];

    const months = [
        "Sty",
        "Lut",
        "Mar",
        "Kwi",
        "Maj",
        "Cze",
        "Lip",
        "Sie",
        "Wrz",
        "Paź",
        "Lis",
        "Gru",
    ];

    const dateObject = createDateObject(stringDate);

    //Get day & month name
    const dayName = days[dateObject.getDay()];
    const monthName = months[dateObject.getMonth()];

    const stringToReturn = `${dayName}, ${dateObject.getDate()} ${monthName} ${dateObject.getFullYear()}`;

    return stringToReturn;
};

const page = ({ searchParams }) => {
    const postMetadata = getPostMetadata("posts");

    const currentPage = searchParams["currentPage"] ?? "1";
    const postsPerPage = searchParams["postsPerPage"] ?? "6";

    const skipPosts = (Number(currentPage) - 1) * Number(postsPerPage);
    const limitPosts = skipPosts + Number(postsPerPage);

    // FIXME convert a.date and b.date into data object then sort
    const allPosts = postMetadata.slice(skipPosts, limitPosts);

    const numOfPages = Math.ceil(
        Number(postMetadata.length) / Number(postsPerPage)
    );

    return (
        <>
            <TitleSection title="Blog" />
            {/* <RecentPosts /> */}
            <div className="dark:bg-black-200">
                <div className="container">
                    <h2
                        data-aos="fade-up"
                        id="blog_heading"
                        className="dark:text-white mb-4"
                    >
                        Wszystkie wpisy na blogu
                    </h2>
                    <div
                        className={`flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 ${
                            numOfPages <= 1 && "pb-5 md:pb-8"
                        }`}
                    >
                        {allPosts.map((post, index) => {
                            return (
                                <Link
                                    key={index}
                                    data-aos="fade-up"
                                    href={createBlogPostSlug(
                                        "/blog/",
                                        post.title
                                    )}
                                    className="flex flex-col [&_*]:cursor-pointer group group"
                                >
                                    <div className="h-[240px] w-full mb-6 md:mb-8">
                                        <Image
                                            src={
                                                post.img ??
                                                "/blog-imgs/placeholder-image.png"
                                            }
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPctevgfgAHYQL2xHt5JgAAAABJRU5ErkJggg=="
                                            width={400}
                                            height={300}
                                            alt={post.alt}
                                            className="w-full h-full object-cover group-hover:brightness-95 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <p className="text-purple-200 text-sm font-semibold">
                                            {createDateString(post.date)}
                                        </p>
                                        <h3 className="dark:text-white group-hover:text-purple-200 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p>{post.excerpt}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    <PaginationControls
                        currentPageProp={currentPage}
                        postsPerPageProp={postsPerPage}
                        numOfPages={numOfPages}
                        hasPrevPage={skipPosts > 0}
                        hasNextPage={limitPosts < postMetadata.length}
                        to="blog_heading"
                    />
                </div>
            </div>
        </>
    );
};

export default page;
