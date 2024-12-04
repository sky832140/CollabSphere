import Image from "next/image";
import image1 from "@/public/about1.jpg";
import image2 from "@/public/about2.jpg";

export const metadata = {
  title: "About",
};

export default function Page() {
  return (
    <div className="grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center">
      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          Welcome to CollabSphere
        </h1>

        <div className="space-y-8">
          <p>
            CollabSphere is where ideas flourish and collaboration thrives. It is 
            your ultimate platform to connect, brainstorm, and achieve success as a team. 
            In today fast-paced world, teamwork is essential, and CollabSphere 
            provides the perfect environment for seamless interaction and productivity.
          </p>
          <p>
            From small startups to large enterprises, our tools are designed to adapt 
            to your team needs. Whether you are planning projects, assigning tasks, 
            or simply sharing updates, CollabSphere makes it effortless and intuitive.
          </p>
          <p>
            This is more than just a workspace—it a hub where creativity meets execution, 
            and teams come together to make impactful decisions. Join us and see how 
            CollabSphere transforms the way you work.
          </p>
        </div>
      </div>

      <div className="col-span-2">
        <Image
          src={image1}
          alt="Teams collaborating over a project plan"
          placeholder="blur"
          quality={80}
        />
      </div>

      <div className="relative aspect-square col-span-2">
        <Image
          src={image2}
          alt="A team brainstorming ideas on a whiteboard"
          placeholder="blur"
          quality={80}
        />
      </div>

      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          Empowering Teams Since Day One
        </h1>

        <div className="space-y-8">
          <p>
            CollabSphere was built with one mission in mind: to empower teams and 
            foster collaboration. From our humble beginnings, we have dedicated ourselves 
            to creating a space where every team member feels valued and equipped to contribute.
          </p>
          <p>
            Over the years, we have fine-tuned our platform to meet the evolving needs 
            of modern workplaces. Our commitment to innovation and user satisfaction 
            has made CollabSphere a trusted name in team collaboration.
          </p>
          <p>
            Here at CollabSphere, we believe that every team deserves a chance to 
            excel. Join us in building a culture of success, one project at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
