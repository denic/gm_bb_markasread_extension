// ==UserScript==
// @name        BB Mark as read
// @namespace   http://chaos-kreativ.de/
// @description Mark all threads as read that are visible on the current page.
// @include     * 
// @version     1
// @grant       none
// @run-at      document-end
// ==/UserScript==

/* globals threadMarkAsRead */

/**
 * @description
 * This GreaseMonkey script can be used to make navigation
 * of unread threads in Burning Boards more comfortable.
 *
 * It adds a quick link to find unread threads to the user options
 * and a link to mark all threads that are visible on current page 
 * as read.
 * This works only on websites/boards where the "BB mark as read" plugin is enabled.
 */
(function () {

    /**
     * @private
     * @property tries
     *
     * Counter variable used to track
     * the number of tries for the mark as
     * read plugin check.
     */
    var tries = 0;
   
    /**
     * @private
     * @function findUnreadItems
     *
     * Rewrites the window location to the search results
     * for unread threads.
     */
    var findUnreadItems = function () {
        var newLocation = window.location.origin;
        
        if (window.location.href.indexOf('index.php') >= 0) {
            newLocation = newLocation + window.location.pathname + '?form=search&action=unread';
        } else {
            newLocation = newLocation + '?form=search&action=unread';
        }

        window.location = newLocation;
    };

    /**
     * @private
     * @function createSearchLink
     *
     * Creator function for the search link.
     */
    var createSearchLink = function () {
        var menu = document.getElementById('userMenu');
        var ul;
        
        if (menu) {
            ul = menu.getElementsByTagName('ul')[0];

            var li   = document.createElement('li');
            var a    = document.createElement('a');
            var span = document.createElement('span');
            var t    = document.createTextNode('Find unread threads');
            
            a.setAttribute('id', 'findUnreadItems');

            span.addEventListener('click', findUnreadItems, true);
            
            span.appendChild(t);
            a.appendChild(span);
            li.appendChild(a);
            ul.appendChild(li);
        }
    };

    /**
     * @private
     * @function createMarkAsReadLink
     *
     * Creator function for the search link.
     */
    var createMarkAsReadLink = function () {
        var pageOptionsDiv = document.querySelector('#main div.pageOptions');
        
        if (pageOptionsDiv) {
            var a    = document.createElement('a');
            var span = document.createElement('span');
            var t    = document.createTextNode('Mark all visible as read.');
            
            a.setAttribute('id', 'markVisibleAsRead');
            a.setAttribute('href', '#');
            a.addEventListener('click', markAllAsRead, true);
            a.appendChild(span);

            span.appendChild(t);

            pageOptionsDiv.appendChild(a);
        }
        
    };

    /**
     * @private
     * @function markAllAsRead
     *
     * Find all thread IDs on the current page
     * and feed them to the BB plugin to mark
     * them as read.
     */
    var markAllAsRead = function (e) {
        e.preventDefault();

        var threads = document.querySelectorAll('td.columnIcon img');

        /**
         * Small saveguard to check that we are 
         * not on the main page or something.
         * 
         * @todo Use window.location.search for this.
         */

        if (threads.length < 30) {

            for (var i = 0; i < threads.length; ++i) {
                var thread = threads[i];
                var id = parseInt(thread.getAttribute('id').replace('threadEdit', ''), 10);

                /**
                 * Use the plugin function to call 
                 * the backend for every unread thread.
                 *
                 * And yup ... this does not only look like a shotgun.
                 */
                threadMarkAsRead.markAsRead(id);
            }
        }
    };

    /**
     * @private
     * @function checkAndInitMarkAsRead
     * 
     * Check if the plugin is available
     * and enable the "mark as read" function.
     */
    var checkAndInitMarkAsRead = function () {
        if (window.threadMarkAsRead) {
            createMarkAsReadLink();
        } else {
            if (++tries <= 4) {
                window.setTimeout(checkAndInitMarkAsRead, 1000);
            } else {
                createMarkAsReadLink();
            }
        }
    };


    /* ******************* */
    /* *** Constructor *** */
    /* ******************* */

    /* Enable the search link. */
    createSearchLink();

    /* Enable mark as read. */
    checkAndInitMarkAsRead();
})();

