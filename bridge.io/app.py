import asyncio

from appserver.sever_init import socket_app
import contactless.cardReaderSetup as contactlessReaderSetup
import contactless.cardWriterSetup as contactlessWriterSetup
import appserver.fastApiRouteSetup as fastApiRoutes
import appserver.socketioRouteSetup as socketioRoutes


async def main():
    """Main function to start the server and NFC listener."""
    import uvicorn

    fastApiRoutes.initialize()
    socketioRoutes.initialize()
    contactlessReaderSetup.setupNtag215Reader()
    #contactlessWriterSetup.setupNtag215Writer()

    config = uvicorn.Config(
        socket_app,
        host="0.0.0.0",
        port=7777,
        log_level="info",
        reload=False,
    )
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(main())
