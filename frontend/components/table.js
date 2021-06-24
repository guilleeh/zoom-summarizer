const Table = ({ data, handleDownload }) => {
  console.log(data);
  const renderStatus = (status) => {
    switch (status) {
      case "completed":
        return (
          <div class="bg-green-500 px-3 py-2 font-extrabold rounded-full">
            Completed
          </div>
        );
      case "queued":
        return (
          <div class="bg-yellow-500 px-3 py-2 font-extrabold rounded-full">
            Queued
          </div>
        );
      case "processing":
        return (
          <div class="bg-yellow-500 px-3 py-2 font-extrabold rounded-full">
            Processing
          </div>
        );

      case "error":
        return (
          <div class="bg-error-600 px-3 py-2 font-extrabold rounded-full">
            Error
          </div>
        );
      default:
        return null;
    }
  };

  if (!data || data.length === 0) {
    return (
      <h3 className="text-2xl font-bold text-center py-10 leading-7 text-gray-900">
        It looks like you don't have any uploaded recordings.{" "}
        <a className="underline text-blue-800" href="/upload">
          Upload
        </a>{" "}
        and audio file to see your transcripts here!
      </h3>
    );
  }

  return (
    <div class="md:px-32 py-2 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-2/4 text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300 ">
                Name
              </th>
              <th class="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300 ">
                Status
              </th>
              <th class="w-1/4 text-left py-3 px-4 uppercase font-semibold text-sm text-gray-300 ">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            {data.map((item) => (
              <tr>
                <td class="w-1/3 text-left py-3 px-4">{item.name}</td>
                <td class="w-1/3 flex justify-start py-3 px-10">
                  {renderStatus(item.status)}
                </td>
                <td class="w-1/3 py-3 px-10">
                  <div className="flex ">
                    {item.status === "completed" && (
                      <button
                        className={`bg-blue-500 px-3 py-2 font-extrabold rounded-full inline-flex items-center`}
                        disabled={item.status !== "completed"}
                        onClick={() => handleDownload(item.id, item.name)}
                      >
                        <svg
                          class="w-4 h-4 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                        </svg>
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
